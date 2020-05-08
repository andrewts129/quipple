import React from 'react';
import { Player } from '../../model/player';
import { StartRequestDto } from '../../dto/outgoing/StartRequestDto';

interface LobbyProps {
    jwt: string;
    player: Player;
    owner: Player | undefined;
    gameId: string;
    socket: SocketIOClient.Socket;
}

export class Lobby extends React.Component<LobbyProps, {}> {
    constructor(props: LobbyProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    private handleClick(): void {
        this.props.socket.emit('start', {
            jwt: this.props.jwt,
            gameId: this.props.gameId
        } as StartRequestDto);
    }

    render() {
        if (this.props.owner) {
            if (this.props.owner.id === this.props.player.id) {
                return (
                    <button type="button" onClick={this.handleClick} className="button is-primary">
                        Start Game
                    </button>
                );
            } else {
                return <p>Waiting for {this.props.owner.screenName} to start the game...</p>;
            }
        } else {
            return <></>;
        }
    }
}
