import React from 'react';

interface ErrorViewProps {
    error: Error;
}

export class ErrorView extends React.Component<ErrorViewProps, {}> {
    render(): JSX.Element {
        console.log(this.props.error);
        return (
            <div className="container">
                <h1 className="title is-1">Quipple</h1>
                <h3 className="subtitle is-3">Error</h3>
                <p>
                    Click <a href="/">here</a> to return to the homepage.
                </p>
            </div>
        );
    }
}
