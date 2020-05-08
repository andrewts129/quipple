import React from 'react';
import { Player } from './model/player';
import { StartGameDto } from './dto/outgoing/StartGameDto';

interface LobbyProps {
    jwt: string;
    player: Player;
    gameId: string;
    socket: SocketIOClient.Socket;
}

export class Lobby extends React.Component<LobbyProps, {}> {
    constructor(props: LobbyProps) {
        super(props);

        this.handleStartGame = this.handleStartGame.bind(this);

        this.props.socket.on('start', this.handleStartGame);
    }

    private handleStartGame(data: StartGameDto): void {
        alert(JSON.stringify(data)); // TODO
    }

    render() {
        return (
            <>
                <button type="button">Start Game</button>
            </>
        );
    }
}
