import React from 'react';
import { StartGameDto } from './dto/outgoing/StartGameDto';
import { JoinGameDto } from './dto/outgoing/JoinGameDto';

// const validScreenName = (screenName: string): boolean => /^[a-zA-Z0-9]{3,20}$/.test(screenName);
// const validGameId = (gameId: string): boolean => /^[a-zA-Z]{5}$/.test(gameId);

type InitGameFormState = {
    screenName: string;
    gameIdToJoin: string;
};

// TODO add validation
export class InitGameForm extends React.Component<any, InitGameFormState> {
    constructor(props: any) {
        super(props);

        this.state = {
            screenName: '',
            gameIdToJoin: ''
        };

        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
        this.handleJoinButtonClick = this.handleJoinButtonClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleStartButtonClick() {
        const data: StartGameDto = {
            screenName: this.state.screenName
        };

        const response = await fetch('/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log(await response.json());
    }

    async handleJoinButtonClick() {
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

        console.log(await response.json());
    }

    handleChange(event: any) {
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
                <label>
                    Screen Name
                    <input
                        name="screenName"
                        type="text"
                        value={this.state.screenName}
                        onChange={this.handleChange}
                    />
                </label>
                <label>
                    Game ID (if joining):
                    <input
                        name="gameIdToJoin"
                        type="text"
                        value={this.state.gameIdToJoin}
                        onChange={this.handleChange}
                    />
                </label>
                <button type="button" onClick={this.handleStartButtonClick}>
                    Start New Game
                </button>
                <button type="button" onClick={this.handleJoinButtonClick}>
                    Join Game
                </button>
            </form>
        );
    }
}
