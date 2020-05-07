import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Player } from './model/player';

interface GameProps extends RouteComponentProps {
    jwt: string | undefined;
    player: Player | undefined;
}

export class Game extends React.Component<GameProps, {}> {
    render() {
        if (this.props.jwt && this.props.player) {
            return (
                <>
                    <p>{this.props.jwt}</p>
                    <p>{JSON.stringify(this.props.player)}</p>
                </>
            );
        } else {
            return <h2>ERROR: Unauthorized</h2>;
        }
    }
}
