import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Player } from './model/player';
import { Lobby } from './Lobby';
import { RegisterDto } from './dto/outgoing/RegisterDto';
import { PlayerListDto } from './dto/incoming/PlayerListDto';
import { NewQuestionDto } from './dto/incoming/NewQuestionDto';

interface GameProps extends RouteComponentProps<{ gameId: string }> {
    jwt: string | undefined;
    player: Player | undefined;
}

interface GameState {
    socket: SocketIOClient.Socket;
}

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            socket: io('/gameplay')
        };

        this.state.socket.on('connect', () => {
            this.state.socket.emit('register', {
                gameId: this.props.gameId,
                jwt: this.props.jwt
            } as RegisterDto);

            this.state.socket.on('newPlayerList', this.handleReceivePlayerList);
            this.state.socket.on('newQuestion', this.handleNewQuestion);
        });

        this.handleReceivePlayerList = this.handleReceivePlayerList.bind(this);
        this.handleNewQuestion = this.handleNewQuestion.bind(this);
    }

    private handleReceivePlayerList(data: PlayerListDto): void {
        alert(JSON.stringify(data)); // TODO
    }

    private handleNewQuestion(data: NewQuestionDto): void {
        alert(JSON.stringify(data)); // TODO
    }

    render() {
        if (this.props.jwt && this.props.player && this.props.gameId) {
            return (
                <>
                    <h2>Game ID: {this.props.gameId}</h2>
                    <h3>Current Players</h3>
                    <ul>
                        <li>{this.props.player.screenName}</li>
                        <li>TODO</li>
                    </ul>
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
