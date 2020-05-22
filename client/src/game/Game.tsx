import React from 'react';
import io from 'socket.io-client';
import { RouteComponentProps } from '@reach/router';
import { Player } from '../model/player';
import { Lobby } from './lobby/Lobby';
import { RegisterDto } from '../dto/outgoing/RegisterDto';
import { PlayerList } from './PlayerList';
import { PlayerListDto } from '../dto/incoming/PlayerListDto';
import { RegisterResponseDto } from '../dto/incoming/RegisterResponseDto';
import { Starting } from './starting/Starting';
import { Question } from './question/Question';
import { Answer } from '../model/answer';
import { NewAnswerDto } from '../dto/incoming/NewAnswerDto';
import { Voting } from './voting/Voting';
import { VotingResultsDto } from '../dto/incoming/VotingResultsDto';
import { Results } from './results/Results';
import { End } from './end/End';

type GameStages = 'lobby' | 'starting' | 'question' | 'voting' | 'results' | 'end';

interface GameProps extends RouteComponentProps<{ gameId: string }> {
    onError: (error: Error) => void;
    onTitleChange: (title: string) => void;
    jwt: string | undefined;
    player: Player | undefined;
}

interface GameState {
    socket: SocketIOClient.Socket | undefined;
    owner: Player | undefined;
    players: (Player | undefined)[];
    stage: GameStages;
    currentQuestion: string;
    remainingQuestions: string[];
    answers: Answer[];
    votes: number[];
}

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            socket: undefined,
            owner: undefined,
            players: [this.props.player],
            stage: 'lobby',
            currentQuestion: '',
            remainingQuestions: [],
            answers: [],
            votes: []
        };

        this.handleConnect = this.handleConnect.bind(this);
        this.handleRegisterResponse = this.handleRegisterResponse.bind(this);
        this.handleReceivePlayerList = this.handleReceivePlayerList.bind(this);
        this.handleStartGame = this.handleStartGame.bind(this);
        this.handleNewAnswer = this.handleNewAnswer.bind(this);
        this.handleVotingResults = this.handleVotingResults.bind(this);
    }

    componentDidMount(): void {
        if (this.props.gameId) {
            this.props.onTitleChange(`${this.props.gameId} - Quipple`);
        }

        const socket = io('/gameplay', { query: { jwt: this.props.jwt || 'noJwt' } });
        socket
            .on('connect', this.handleConnect)
            .on('newPlayerList', this.handleReceivePlayerList)
            .on('start', this.handleStartGame)
            .on('newAnswer', this.handleNewAnswer)
            .on('votingResults', this.handleVotingResults)
            .on('error', () => {
                this.props.onError(new Error('Error from server'));
            })
            .on('connect_error', () => {
                this.props.onError(new Error('Server connection error'));
            })
            .on('connect_timeout', () => {
                this.props.onError(new Error('Connection attempt to server timed out'));
            })
            .on('disconnect', () => {
                this.props.onError(new Error('Connection with server lost'));
            });

        this.setState({ socket });
    }

    private handleConnect(): void {
        this.state.socket?.emit(
            'register',
            {
                gameId: this.props.gameId
            } as RegisterDto,
            this.handleRegisterResponse
        );
    }

    private handleRegisterResponse(data: RegisterResponseDto): void {
        this.setState({
            currentQuestion: data.questions[0],
            remainingQuestions: data.questions.slice(1)
        });
    }

    private handleReceivePlayerList(data: PlayerListDto): void {
        this.setState({ owner: data.owner, players: data.players });
    }

    private handleStartGame(): void {
        this.setState({ stage: 'starting' });

        setTimeout(() => {
            this.setState({ stage: 'question' });
        }, 3000);
    }

    private handleNewAnswer(data: NewAnswerDto): void {
        this.setState(
            (oldState) => ({
                answers: [...oldState.answers, data]
            }),
            () => {
                // Checks if all answers are in. +1 to account for owner
                if (this.state.answers.length >= this.state.players.length + 1) {
                    this.setState({ stage: 'voting' });
                }
            }
        );
    }

    private handleVotingResults(data: VotingResultsDto): void {
        this.setState({ stage: 'results', votes: data.votes });

        // TODO make this dependent on user input
        setInterval(() => {
            this.setState((oldState) => {
                if (oldState.remainingQuestions.length > 0) {
                    return {
                        currentQuestion: oldState.remainingQuestions[0],
                        remainingQuestions: oldState.remainingQuestions.slice(1),
                        stage: 'question'
                    };
                } else {
                    // Setting the question properties is redundant but it's necessary for the compiler
                    return {
                        currentQuestion: '',
                        remainingQuestions: [],
                        stage: 'end'
                    };
                }
            });
        }, 6000);
    }

    render(): JSX.Element {
        if (!this.state.socket) {
            return <h3 className="subtitle is-3">Loading...</h3>;
        } else if (this.props.jwt && this.props.player && this.props.gameId) {
            return (
                <>
                    <h3 className="subtitle is-3">
                        Game ID: <span className="has-text-weight-bold">{this.props.gameId}</span>
                    </h3>
                    <PlayerList players={[this.state.owner, ...this.state.players]} />
                    {this.getStageBody(this.state.stage)}
                </>
            );
        } else {
            this.props.onError(new Error('Unauthorized'));
            return <></>;
        }
    }

    private getStageBody(stage: GameStages): JSX.Element {
        // These all exist, just making the compiler happy
        if (this.props.player && this.props.gameId && this.state.socket) {
            switch (stage) {
                case 'lobby':
                    return (
                        <Lobby
                            player={this.props.player}
                            owner={this.state.owner}
                            gameId={this.props.gameId}
                            socket={this.state.socket}
                        />
                    );
                case 'starting':
                    return <Starting />;
                case 'question':
                    return (
                        <Question
                            question={this.state.currentQuestion}
                            socket={this.state.socket}
                        />
                    );
                case 'voting':
                    return (
                        <Voting
                            question={this.state.currentQuestion}
                            answers={this.state.answers}
                            player={this.props.player}
                            socket={this.state.socket}
                        />
                    );
                case 'results':
                    return (
                        <Results
                            question={this.state.currentQuestion}
                            answers={this.state.answers}
                            votes={this.state.votes}
                        />
                    );
                case 'end':
                    return <End />;
                default:
                    return <p>ERROR</p>;
            }
        } else {
            return <></>;
        }
    }
}
