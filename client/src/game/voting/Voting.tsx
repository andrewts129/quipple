import React from 'react';
import { Answer } from '../../model/answer';

interface VotingProps {
    answers: Answer[];
    socket: SocketIOClient.Socket;
}

export class Voting extends React.Component<VotingProps, {}> {
    render(): JSX.Element {
        const listElements = this.props.answers.map((answer) => <li>{answer.answer}</li>);
        return (
            <>
                <h3 className="subtitle is-3">Answers</h3>
                <ul>{listElements}</ul>
            </>
        );
    }
}
