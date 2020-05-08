import React from 'react';
import { SubmitAnswerDto } from '../../dto/outgoing/SubmitAnswerDto';

interface QuestionProps {
    jwt: string;
    questions: string[];
    socket: SocketIOClient.Socket;
}

interface QuestionState {
    answer: string;
    submitted: boolean;
}

export class Question extends React.Component<QuestionProps, QuestionState> {
    constructor(props: QuestionProps) {
        super(props);

        this.state = {
            answer: '',
            submitted: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    private handleSubmit(): void {
        const answer = 'todo'; // TODO

        this.props.socket.emit('submitAnswer', {
            answer,
            jwt: this.props.jwt
        } as SubmitAnswerDto);

        this.setState({ answer, submitted: true });
    }

    render() {
        const answerSection = this.state.submitted ? (
            <p>{this.state.answer}</p>
        ) : (
            <form>
                <input type="text" />
                <button type="button" onClick={this.handleSubmit}>
                    Submit
                </button>
            </form>
        );

        return (
            <>
                <h3>Question</h3>
                <p>{this.props.questions[0]}</p>
                <h3>Your Answer</h3>
                {answerSection}
            </>
        );
    }
}
