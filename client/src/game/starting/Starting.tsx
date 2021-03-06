import React from 'react';

interface StartingState {
    secondsLeft: number;
}

export class Starting extends React.Component<{}, StartingState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            secondsLeft: 3
        };
    }

    componentDidMount(): void {
        setTimeout(() => {
            this.setState({ secondsLeft: 2 });
        }, 1000);
        setTimeout(() => {
            this.setState({ secondsLeft: 1 });
        }, 2000);
    }

    render(): JSX.Element {
        return <p>The game is starting in {this.state.secondsLeft}...</p>;
    }
}
