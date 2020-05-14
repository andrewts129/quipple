import React from 'react';
import { Answer } from '../../model/answer';
import { Player } from '../../model/player';
import { VoteDto } from '../../dto/outgoing/VoteDto';

interface VotingProps {
    answers: Answer[];
    player: Player;
    socket: SocketIOClient.Socket;
}

interface VotingState {
    voted: boolean;
}

export class Voting extends React.Component<VotingProps, VotingState> {
    constructor(props: VotingProps) {
        super(props);

        this.state = {
            voted: false
        };

        this.renderAnswerListElement = this.renderAnswerListElement.bind(this);
        this.onVoteButtonClick = this.onVoteButtonClick.bind(this);
    }

    private renderAnswerListElement(answer: Answer): JSX.Element {
        // Don't show button for own answer and don't show any buttons after voting
        const maybeButton =
            this.state.voted || answer.player.id === this.props.player.id ? (
                <></>
            ) : (
                <button
                    type="button"
                    onClick={() => this.onVoteButtonClick(answer.player.id)}
                    className="button is-primary"
                >
                    Vote as Best
                </button>
            );

        // TODO this looks terrible
        return (
            <li key={answer.player.id}>
                {answer.answer}
                {maybeButton}
            </li>
        );
    }

    private onVoteButtonClick(answerPlayerId: number): void {
        this.props.socket.emit('vote', {
            answerPlayerId
        } as VoteDto);

        this.setState({ voted: true });
    }

    render(): JSX.Element {
        const listElements = this.props.answers.map((answer) =>
            this.renderAnswerListElement(answer)
        );

        return (
            <>
                <h3 className="subtitle is-3">Answers</h3>
                <div className="content">
                    <ul>{listElements}</ul>
                </div>
            </>
        );
    }
}
