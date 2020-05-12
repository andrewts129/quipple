import React from 'react';
import { InitGameForm } from './InitGameForm';
import { RouteComponentProps } from '@reach/router';
import { Player } from '../model/player';

interface HomeProps extends RouteComponentProps {
    onError: (error: Error) => void;
    onTitleChange: (title: string) => void;
    onJwtChange: (jwt: string) => void;
    onPlayerChange: (player: Player) => void;
}

export class Home extends React.Component<HomeProps, {}> {
    componentDidMount(): void {
        this.props.onTitleChange('Quipple');
    }

    render(): JSX.Element {
        return (
            <InitGameForm
                onError={this.props.onError}
                onJwtChange={this.props.onJwtChange}
                onPlayerChange={this.props.onPlayerChange}
            />
        );
    }
}
