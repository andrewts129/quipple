import React from 'react';
import { App } from './App';

interface ErrorBoundaryState {
    error: Error | null;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    constructor(props: {}) {
        super(props);
        this.state = { error: null };

        this.handleError = this.handleError.bind(this);
    }

    // These two function handle errors thrown in rendering
    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error);
        console.log(errorInfo);
    }

    // This is called manually
    private handleError(error: Error) {
        console.log(error);
        this.setState({ error });
    }

    render() {
        if (this.state.error) {
            return (
                <div className="container">
                    <h1 className="title is-1">Quipple</h1>
                    <h3 className="subtitle is-3">Error</h3>
                    <p>
                        Click <a href="/">here</a> to return to the homepage.
                    </p>
                </div>
            );
        } else {
            return <App onError={this.handleError} />;
        }
    }
}
