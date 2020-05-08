import React from 'react';
import { InitGameForm } from './InitGameForm';
import { RouteComponentProps } from '@reach/router';
import { Player } from '../model/player';

interface HomeProps extends RouteComponentProps {
    onJwtChange: (jwt: string) => void;
    onPlayerChange: (player: Player) => void;
}

export class Home extends React.Component<HomeProps, {}> {
    render() {
        return (
            <InitGameForm
                onJwtChange={this.props.onJwtChange}
                onPlayerChange={this.props.onPlayerChange}
            />
        );
    }
}
