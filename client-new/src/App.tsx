import React from 'react';
import { Home } from './Home';

type AppState = {
    jwt: string | undefined;
};

export class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            jwt: undefined
        };

        this.handleJwtChange = this.handleJwtChange.bind(this);
    }

    handleJwtChange(jwt: string): void {
        this.setState({ jwt });
    }

    render() {
        return <Home onJwtChange={this.handleJwtChange} />;
    }
}
