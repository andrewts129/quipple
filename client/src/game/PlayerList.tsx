import React from 'react';
import { Player } from '../model/player';

interface PlayerListProps {
    players: (Player | undefined)[];
}

export class PlayerList extends React.Component<PlayerListProps, {}> {
    render(): JSX.Element {
        const listItems = this.props.players
            .filter((player) => player)
            .map((player) => <li key={player?.id}>{player?.screenName}</li>);
        return (
            <>
                <h5 className="subtitle is-5">Players:</h5>
                <div className="content">
                    <ul>{listItems}</ul>
                </div>
            </>
        );
    }
}
