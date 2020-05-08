import React from 'react';
import { navigate } from '@reach/router';
import { CreateGameDto } from '../dto/outgoing/CreateGameDto';
import { JoinGameDto } from '../dto/outgoing/JoinGameDto';
import { CreateJoinResponseDto } from '../dto/incoming/CreateJoinResponseDto';
import { Player } from '../model/player';

// const validScreenName = (screenName: string): boolean => /^[a-zA-Z0-9]{3,20}$/.test(screenName);
// const validGameId = (gameId: string): boolean => /^[a-zA-Z]{5}$/.test(gameId);

interface InitGameProps {
    onJwtChange: (jwt: string) => void;
    onPlayerChange: (player: Player) => void;
}

interface InitGameFormState {
    screenName: string;
    gameIdToJoin: string;
}

// TODO add validation
export class InitGameForm extends React.Component<InitGameProps, InitGameFormState> {
    constructor(props: InitGameProps) {
        super(props);

        this.state = {
            screenName: '',
            gameIdToJoin: ''
        };

        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
        this.handleJoinButtonClick = this.handleJoinButtonClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    private async handleStartButtonClick(): Promise<void> {
        const data: CreateGameDto = {
            screenName: this.state.screenName
        };

        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        this.handleServerResponse(await response.json());
    }

    private async handleJoinButtonClick(): Promise<void> {
        const data: JoinGameDto = {
            screenName: this.state.screenName,
            gameIdToJoin: this.state.gameIdToJoin
        };

        const response = await fetch('/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        this.handleServerResponse(await response.json());
    }

    private handleServerResponse(response: CreateJoinResponseDto): void {
        this.props.onJwtChange(response.jwt);
        this.props.onPlayerChange(response.player);
        navigate(`/g/${response.gameId}`);
    }

    private handleChange(event: any): void {
        const targetValue = event.target.value;
        const targetName = event.target.name;

        if (targetName === 'screenName') {
            this.setState({ screenName: targetValue });
        } else if (targetName === 'gameIdToJoin') {
            this.setState({ gameIdToJoin: targetValue });
        }
    }

    render() {
        return (
            <form>
                <div className="field">
                    <label htmlFor="screenName" className="label">
                        Screen Name
                    </label>
                    <input
                        name="screenName"
                        type="text"
                        value={this.state.screenName}
                        onChange={this.handleChange}
                        className="input control"
                    />
                </div>
                <div className="field">
                    <label htmlFor="gameIdToJoin" className="label">
                        Game ID (if joining):
                    </label>
                    <input
                        name="gameIdToJoin"
                        type="text"
                        value={this.state.gameIdToJoin}
                        onChange={this.handleChange}
                        className="input control"
                    />
                </div>
                <div className="field is-grouped">
                    <div className="control">
                        <button
                            type="button"
                            onClick={this.handleStartButtonClick}
                            className="button is-primary"
                        >
                            Start New Game
                        </button>
                    </div>
                    <div className="control">
                        <button
                            type="button"
                            onClick={this.handleJoinButtonClick}
                            className="button is-primary"
                        >
                            Join Game
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}
