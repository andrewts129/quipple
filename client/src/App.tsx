import React from 'react';
import { Router } from '@reach/router';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Home } from './home/Home';
import { Game } from './game/Game';
import { Player } from './model/player';
import './App.scss';
import { NotFound } from './NotFound';

interface AppState {
    title: string;
    jwt: string | undefined;
    player: Player | undefined;
    hasError: boolean;
}

export class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            title: 'Quipple',
            jwt: undefined,
            player: undefined,
            hasError: false
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleJwtChange = this.handleJwtChange.bind(this);
        this.handlePlayerChange = this.handlePlayerChange.bind(this);
    }

    static getDerivedStateFromError() {
        return { hasError: true };
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
        if (this.state.hasError) {
            return <h1>Internal Server Error</h1>;
        } else {
            return (
                <>
                    <HelmetProvider>
                        <Helmet>
                            <title>{this.state.title}</title>
                        </Helmet>
                    </HelmetProvider>
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
                            />
                            <NotFound default />
                        </Router>
                    </div>
                </>
            );
        }
    }
}
