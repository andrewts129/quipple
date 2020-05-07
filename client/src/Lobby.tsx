import React from 'react';
import { Player } from './model/player';
import { StartRequestDto } from './dto/outgoing/StartRequestDto';

interface LobbyProps {
    jwt: string;
    player: Player;
    gameId: string;
    socket: SocketIOClient.Socket;
}

export class Lobby extends React.Component<LobbyProps, {}> {
    constructor(props: LobbyProps) {
        super(props);

        this.props.socket.on('start', this.handleStartGameFromServer);

        this.handleStartGameFromServer = this.handleStartGameFromServer.bind(this);
    }

    private handleStartGameFromServer(data: StartRequestDto): void {
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
