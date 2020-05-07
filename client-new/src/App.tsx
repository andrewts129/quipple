import React from 'react';
import { Router } from '@reach/router';
import { Home } from './Home';
import { Game } from './Game';
import { Player } from './model/player';

interface AppState {
    jwt: string | undefined;
    player: Player | undefined;
}

export class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            jwt: undefined,
            player: undefined
        };

        this.handleJwtChange = this.handleJwtChange.bind(this);
        this.handlePlayerChange = this.handlePlayerChange.bind(this);
    }

    handleJwtChange(jwt: string): void {
        this.setState({ jwt });
    }

    handlePlayerChange(player: Player): void {
        this.setState({ player });
    }

    render() {
        return (
            <>
                <h1>Quipple</h1>
                <Router>
                    <Home
                        path="/"
                        onJwtChange={this.handleJwtChange}
                        onPlayerChange={this.handlePlayerChange}
                    />
                    <Game path="/g/:gameId" jwt={this.state.jwt} player={this.state.player}></Game>
                </Router>
            </>
        );
    }
}
