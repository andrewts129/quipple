import React from 'react';
import { InitGameForm } from './InitGameForm';

export class Home extends React.Component {
    render() {
        return (
            <>
                <h1>Quipple</h1>
                <InitGameForm />
            </>
        );
    }
}
