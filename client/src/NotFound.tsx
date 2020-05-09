import React from 'react';
import { RouteComponentProps } from '@reach/router';

export class NotFound extends React.Component<RouteComponentProps, {}> {
    render(): JSX.Element {
        return (
            <>
                <h3 className="subtitle is-3">Not Found</h3>
                <p>
                    Click <a href="/">here</a> to return to the homepage.
                </p>
            </>
        );
    }
}
