import React from 'react';

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

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event: React.SyntheticEvent) {
        alert(`${this.state.screenName} ${this.state.gameIdToJoin}`);
        event.preventDefault();
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
            <form onSubmit={this.handleSubmit}>
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
                <button type="submit">Start New Game</button>
                <button type="submit">Join Game</button>
            </form>
        );
    }
}
