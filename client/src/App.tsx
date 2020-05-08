import React from 'react';
import { Router } from '@reach/router';
import { Helmet } from 'react-helmet';
import { Home } from './home/Home';
import { Game } from './game/Game';
import { Player } from './model/player';

interface AppState {
    title: string;
    jwt: string | undefined;
    player: Player | undefined;
}

export class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            title: 'Quipple',
            jwt: undefined,
            player: undefined
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleJwtChange = this.handleJwtChange.bind(this);
        this.handlePlayerChange = this.handlePlayerChange.bind(this);
    }

    handleTitleChange(title: string): void {
        this.setState({ title });
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
                <Helmet>
                    <title>{this.state.title}</title>
                </Helmet>
                <div className="container">
                    <h1 className="title is-1">Quipple</h1>
                    <Router>
                        <Home
                            path="/"
                            onTitleChange={this.handleTitleChange}
                            onJwtChange={this.handleJwtChange}
                            onPlayerChange={this.handlePlayerChange}
                        />
                        <Game
                            path="/g/:gameId"
                            onTitleChange={this.handleTitleChange}
                            jwt={this.state.jwt}
                            player={this.state.player}
                        ></Game>
                    </Router>
                </div>
            </>
        );
    }
}
