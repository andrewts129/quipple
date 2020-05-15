import React from 'react';
import { Answer } from '../../model/answer';

interface ResultsProps {
    question: string;
    answers: Answer[];
    votes: number[];
}

export class Results extends React.Component<ResultsProps, {}> {
    private static renderResultTile(answer: Answer, numVotes: number): JSX.Element {
        return (
            <div className="tile is-4 is-parent">
                <div className="tile is-child box">
                    <p className="subtitle">{answer.answer}</p>
                    <p>{answer.player.screenName}</p>
                    <p>Votes: {numVotes}</p>
                </div>
            </div>
        );
    }

    private static getVotesByPlayerId(votes: number[]): Map<number, number> {
        const result = new Map();
        for (const voteFor of votes) {
            result.set(voteFor, (result.get(voteFor) || 0) + 1);
        }
        return result;
    }

    render(): JSX.Element {
        const votesByPlayerId = Results.getVotesByPlayerId(this.props.votes);
        const tiles = this.props.answers.map((answer) =>
            Results.renderResultTile(answer, votesByPlayerId.get(answer.player.id) || 0)
        );

        return (
            <>
                <h3 className="subtitle is-3">Answers</h3>
                <div className="tile is-ancestor">{tiles}</div>
            </>
        );
    }
}
