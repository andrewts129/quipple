import React from 'react';
import { navigate } from '@reach/router';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CreateGameDto } from '../dto/outgoing/CreateGameDto';
import { JoinGameDto } from '../dto/outgoing/JoinGameDto';
import { CreateJoinResponseDto } from '../dto/incoming/CreateJoinResponseDto';
import { Player } from '../model/player';
import { HttpErrorResponseDto } from '../dto/incoming/HttpErrorResponseDto';

interface InitGameProps {
    onError: (error: Error) => void;
    onJwtChange: (jwt: string) => void;
    onPlayerChange: (player: Player) => void;
}

export class InitGameForm extends React.Component<InitGameProps, {}> {
    constructor(props: InitGameProps) {
        super(props);

        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
        this.handleJoinButtonClick = this.handleJoinButtonClick.bind(this);
    }

    private async handleStartButtonClick(screenName: string): Promise<void> {
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ screenName } as CreateGameDto)
        });

        this.handleServerResponse(await response.json());
    }

    private async handleJoinButtonClick(screenName: string, gameIdToJoin: string): Promise<void> {
        const response = await fetch('/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                screenName,
                gameIdToJoin
            } as JoinGameDto)
        });

        this.handleServerResponse(await response.json());
    }

    private handleServerResponse(response: CreateJoinResponseDto | HttpErrorResponseDto): void {
        const isSuccess = (arg: any): arg is CreateJoinResponseDto => {
            return arg && arg.gameId && arg.jwt && arg.player;
        };

        const isError = (arg: any): arg is HttpErrorResponseDto => {
            return arg && arg.statusCode;
        };

        if (isSuccess(response)) {
            this.props.onJwtChange(response.jwt);
            this.props.onPlayerChange(response.player);
            navigate(`/g/${response.gameId}`);
        } else if (isError(response) && response.statusCode === 404) {
            this.props.onError(new Error('Game not found'));
        } else {
            this.props.onError(new Error('Unexpected server error'));
        }
    }

    render(): JSX.Element {
        const schema = Yup.object().shape({
            screenName: Yup.string()
                .required()
                .min(3)
                .max(20)
                .matches(/^[a-zA-Z0-9]+$/),
            gameIdToJoin: Yup.string()
                .notRequired()
                .length(5)
                .matches(/^[a-zA-Z]+$/)
                .when('isJoin', {
                    is: true,
                    then: Yup.string().required()
                }),
            isJoin: Yup.boolean()
        });

        return (
            <Formik
                initialValues={{ screenName: '', gameIdToJoin: '', isJoin: false }}
                validationSchema={schema}
                onSubmit={(values) => {
                    if (values.isJoin) {
                        this.handleJoinButtonClick(values.screenName, values.gameIdToJoin);
                    } else {
                        this.handleStartButtonClick(values.screenName);
                    }
                }}
            >
                {({ setFieldValue, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="screenName" className="label">
                                Screen Name
                            </label>
                            <Field name="screenName" type="text" className="input control" />
                            <ErrorMessage name="screenName" />
                        </div>
                        <div className="field">
                            <label htmlFor="gameIdToJoin" className="label">
                                Game ID (if joining):
                            </label>
                            <Field name="gameIdToJoin" type="text" className="input control" />
                            <ErrorMessage name="gameIdToJoin" />
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button
                                    name="start"
                                    type="button"
                                    className="button is-primary"
                                    onClick={() => {
                                        setFieldValue('isJoin', false);
                                        // Hack that ensures the submit happens after the 'isJoin' is set
                                        // Needed because 'setFieldValue' is async but can't be awaited?
                                        setTimeout(() => handleSubmit(), 0);
                                    }}
                                >
                                    Start New Game
                                </button>
                            </div>
                            <div className="control">
                                <button
                                    name="join"
                                    type="button"
                                    className="button is-primary"
                                    onClick={() => {
                                        setFieldValue('isJoin', true);
                                        // See above for hack explanation
                                        setTimeout(() => handleSubmit(), 0);
                                    }}
                                >
                                    Join Game
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        );
    }
}
