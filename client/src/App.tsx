import React from 'react';
import { Router } from '@reach/router';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Home } from './home/Home';
import { Game } from './game/Game';
import { Player } from './model/player';
import './App.scss';

interface AppProps {
    onError: (error: Error) => void;
}

interface AppState {
    title: string;
    jwt: string | undefined;
    player: Player | undefined;
}

export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
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

    private handleTitleChange(title: string): void {
        this.setState({ title });
    }

    private handleJwtChange(jwt: string): void {
        this.setState({ jwt });
    }

    private handlePlayerChange(player: Player): void {
        this.setState({ player });
    }

    render(): JSX.Element {
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
                            onError={this.props.onError}
                            onTitleChange={this.handleTitleChange}
                            onJwtChange={this.handleJwtChange}
                            onPlayerChange={this.handlePlayerChange}
                        />
                        <Game
                            path="/g/:gameId"
                            onError={this.props.onError}
                            onTitleChange={this.handleTitleChange}
                            jwt={this.state.jwt}
                            player={this.state.player}
                        />
                    </Router>
                </div>
            </>
        );
    }
}
