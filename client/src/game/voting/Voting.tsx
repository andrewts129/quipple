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

        this.renderAnswerCard = this.renderAnswerCard.bind(this);
        this.onVoteButtonClick = this.onVoteButtonClick.bind(this);
    }

    private renderAnswerCard(answer: Answer): JSX.Element {
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

        return (
            <div className="tile is-4 is-parent">
                <div className="tile is-child box">
                    <p className="subtitle">{answer.answer}</p>
                    {maybeButton}
                </div>
            </div>
        );
    }

    private onVoteButtonClick(forPlayerId: number): void {
        this.props.socket.emit('vote', {
            forPlayerId
        } as VoteDto);

        this.setState({ voted: true });
    }

    render(): JSX.Element {
        const answerCards = this.props.answers.map((answer) => this.renderAnswerCard(answer));
        const postVoteMessage = this.state.voted ? (
            <p>Waiting for other players to vote...</p>
        ) : (
            <></>
        );

        return (
            <>
                <h3 className="subtitle is-3">Answers</h3>
                <div className="tile is-ancestor">{answerCards}</div>
                {postVoteMessage}
            </>
        );
    }
}
