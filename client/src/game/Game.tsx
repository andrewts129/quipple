import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Player } from '../model/player';
import { Lobby } from './lobby/Lobby';
import { RegisterDto } from '../dto/outgoing/RegisterDto';
import { PlayerList } from './PlayerList';
import { PlayerListDto } from '../dto/incoming/PlayerListDto';
import { StartGameDto } from '../dto/incoming/StartGameDto';
import { Starting } from './starting/Starting';
import { Question } from './question/Question';
import io from 'socket.io-client';

type GameStages = 'lobby' | 'starting' | 'question';

interface GameProps extends RouteComponentProps<{ gameId: string }> {
    onTitleChange: (title: string) => void;
    jwt: string | undefined;
    player: Player | undefined;
}

interface GameState {
    socket: SocketIOClient.Socket | undefined;
    owner: Player | undefined;
    players: (Player | undefined)[];
    stage: GameStages;
    questions: string[];
}

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            socket: undefined,
            owner: undefined,
            players: [this.props.player],
            stage: 'lobby',
            questions: []
        };

        this.handleConnect = this.handleConnect.bind(this);
        this.handleReceivePlayerList = this.handleReceivePlayerList.bind(this);
        this.handleStartGame = this.handleStartGame.bind(this);
    }

    componentDidMount() {
        if (this.props.gameId) {
            this.props.onTitleChange(`${this.props.gameId} - Quipple`);
        }

        const socket = io('/gameplay', { query: { jwt: this.props.jwt || 'noJwt' } });
        socket
            .on('connect', this.handleConnect)
            .on('newPlayerList', this.handleReceivePlayerList)
            .on('start', this.handleStartGame)
            .on('error', () => {
                alert('socket error');
            })
            .on('connect_error', () => {
                alert('socket connection error');
            })
            .on('connect_error', () => {
                alert('socket connection timeout');
            })
            .on('disconnect', () => {
                alert('socket disconnect');
            });

        this.setState({ socket });
    }

    private handleConnect(): void {
        this.state.socket?.emit('register', {
            gameId: this.props.gameId,
            jwt: this.props.jwt
        } as RegisterDto);
    }

    private handleReceivePlayerList(data: PlayerListDto): void {
        this.setState({ owner: data.owner, players: data.players });
    }

    private handleStartGame(data: StartGameDto): void {
        this.setState({ stage: 'starting', questions: data.questions });

        setTimeout(() => {
            this.setState({ stage: 'question' });
        }, 3000);
    }

    render() {
        if (!this.state.socket) {
            return <h3 className="subtitle is-3">Loading...</h3>;
        } else if (this.props.jwt && this.props.player && this.props.gameId) {
            return (
                <>
                    <h3 className="subtitle is-3">
                        Game ID: <span className="has-text-weight-bold">{this.props.gameId}</span>
                    </h3>
                    <PlayerList players={[this.state.owner, ...this.state.players]} />
                    {this.getStageBody(this.state.stage)}
                </>
            );
        } else {
            return (
                <>
                    <h3 className="subtitle is-3">Unauthorized</h3>
                    <p>
                        Click <a href="/">here</a> to return to the homepage.
                    </p>
                </>
            );
        }
    }

    private getStageBody(stage: GameStages) {
        // These all exist, just making the compiler happy
        if (this.props.jwt && this.props.player && this.props.gameId && this.state.socket) {
            switch (stage) {
                case 'lobby':
                    return (
                        <Lobby
                            jwt={this.props.jwt}
                            player={this.props.player}
                            owner={this.state.owner}
                            gameId={this.props.gameId}
                            socket={this.state.socket}
                        />
                    );
                case 'starting':
                    return <Starting />;
                case 'question':
                    return (
                        <Question
                            jwt={this.props.jwt}
                            questions={this.state.questions}
                            socket={this.state.socket}
                        />
                    );
                default:
                    return <p>ERROR</p>;
            }
        } else {
            return <></>;
        }
    }
}
