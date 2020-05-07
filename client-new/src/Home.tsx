import React from 'react';
import { InitGameForm } from './InitGameForm';

type HomeProps = {
    onJwtChange: (jwt: string) => void;
};

export class Home extends React.Component<HomeProps, {}> {
    constructor(props: HomeProps) {
        super(props);
    }

    render() {
        return (
            <>
                <h1>Quipple</h1>
                <InitGameForm onJwtChange={this.props.onJwtChange} />
            </>
        );
    }
}
