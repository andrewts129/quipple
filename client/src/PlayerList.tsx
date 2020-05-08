import React from 'react';
import { Player } from './model/player';

interface PlayerListProps {
    players: (Player | undefined)[];
}

export class PlayerList extends React.Component<PlayerListProps, {}> {
    render() {
        const listItems = this.props.players
            .filter((player) => player)
            .map((player) => <li key={player?.id}>{player?.screenName}</li>);
        return (
            <>
                <h3>Players:</h3>
                <ul>{listItems}</ul>
            </>
        );
    }
}
