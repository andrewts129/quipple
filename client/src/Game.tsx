import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Player } from './model/player';
import { Lobby } from './Lobby';
import { RegisterDto } from './dto/outgoing/RegisterDto';
import { NewQuestionDto } from './dto/incoming/NewQuestionDto';
import { PlayerList } from './PlayerList';
import { PlayerListDto } from './dto/incoming/PlayerListDto';

interface GameProps extends RouteComponentProps<{ gameId: string }> {
    jwt: string | undefined;
    player: Player | undefined;
}

interface GameState {
    socket: SocketIOClient.Socket;
    owner: Player | undefined;
    players: (Player | undefined)[];
}

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            socket: io('/gameplay'),
            owner: undefined,
            players: [this.props.player]
        };

        this.handleNewQuestion = this.handleNewQuestion.bind(this);
        this.handleReceivePlayerList = this.handleReceivePlayerList.bind(this);

        this.state.socket.on('connect', () => {
            this.state.socket.emit('register', {
                gameId: this.props.gameId,
                jwt: this.props.jwt
            } as RegisterDto);

            this.state.socket.on('newQuestion', this.handleNewQuestion);
            this.state.socket.on('newPlayerList', this.handleReceivePlayerList);
        });
    }

    private handleReceivePlayerList(data: PlayerListDto): void {
        this.setState({ owner: data.owner, players: data.players });
    }

    private handleNewQuestion(data: NewQuestionDto): void {
        alert(JSON.stringify(data)); // TODO
    }

    render() {
        if (this.props.jwt && this.props.player && this.props.gameId) {
            return (
                <>
                    <h2>Game ID: {this.props.gameId}</h2>
                    <PlayerList players={[this.state.owner, ...this.state.players]} />
                    <Lobby
                        jwt={this.props.jwt}
                        player={this.props.player}
                        gameId={this.props.gameId}
                        socket={this.state.socket}
                    />
                </>
            );
        } else {
            return <h2>ERROR: Unauthorized</h2>;
        }
    }
}
