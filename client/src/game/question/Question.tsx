import React from 'react';
import { SubmitAnswerDto } from '../../dto/outgoing/SubmitAnswerDto';

interface QuestionProps {
    question: string;
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
        this.handleChange = this.handleChange.bind(this);
    }

    private handleSubmit(): void {
        this.props.socket.emit('submitAnswer', {
            answer: this.state.answer
        } as SubmitAnswerDto);

        this.setState({ submitted: true });
    }

    private handleChange(event: any): void {
        this.setState({ answer: event.target.value });
    }

    render(): JSX.Element {
        const answerSection = this.state.submitted ? (
            <p>{this.state.answer}</p>
        ) : (
            <form>
                <div className="field">
                    <input type="text" onChange={this.handleChange} className="input control" />
                </div>
                <div className="field">
                    <button type="button" onClick={this.handleSubmit} className="button is-primary">
                        Submit
                    </button>
                </div>
            </form>
        );

        return (
            <>
                <h3 className="subtitle is-3">Question</h3>
                <p>{this.props.question}</p>
                <h3 className="subtitle is-3">Your Answer</h3>
                {answerSection}
            </>
        );
    }
}
