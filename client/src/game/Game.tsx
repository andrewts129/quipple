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

type GameStages = 'lobby' | 'starting' | 'question';

interface GameProps extends RouteComponentProps<{ gameId: string }> {
    jwt: string | undefined;
    player: Player | undefined;
}

interface GameState {
    socket: SocketIOClient.Socket;
    owner: Player | undefined;
    players: (Player | undefined)[];
    stage: GameStages;
    questions: string[];
}

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            socket: io('/gameplay'),
            owner: undefined,
            players: [this.props.player],
            stage: 'lobby',
            questions: []
        };

        this.handleReceivePlayerList = this.handleReceivePlayerList.bind(this);
        this.handleStartGame = this.handleStartGame.bind(this);
    }

    componentDidMount() {
        this.state.socket.on('connect', () => {
            this.state.socket.emit('register', {
                gameId: this.props.gameId,
                jwt: this.props.jwt
            } as RegisterDto);

            this.state.socket.on('newPlayerList', this.handleReceivePlayerList);
            this.state.socket.on('start', this.handleStartGame);
        });
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
        if (this.props.jwt && this.props.player && this.props.gameId) {
            return (
                <>
                    <h2>Game ID: {this.props.gameId}</h2>
                    <PlayerList players={[this.state.owner, ...this.state.players]} />
                    {this.getStageBody(this.state.stage)}
                </>
            );
        } else {
            return <h2>ERROR: Unauthorized</h2>;
        }
    }

    private getStageBody(stage: GameStages) {
        // These all exist, just making the compiler happy
        if (this.props.jwt && this.props.player && this.props.gameId) {
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
