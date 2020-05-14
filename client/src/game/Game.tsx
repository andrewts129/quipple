import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Player } from '../model/player';
import { Lobby } from './lobby/Lobby';
import { RegisterDto } from '../dto/outgoing/RegisterDto';
import { PlayerList } from './PlayerList';
import { PlayerListDto } from '../dto/incoming/PlayerListDto';
import { RegisterResponseDto } from '../dto/incoming/RegisterResponseDto';
import { Starting } from './starting/Starting';
import { Question } from './question/Question';
import io from 'socket.io-client';
import { Answer } from '../model/answer';
import { NewAnswerDto } from '../dto/incoming/NewAnswerDto';
import { Voting } from './voting/Voting';

type GameStages = 'lobby' | 'starting' | 'question' | 'voting';

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
    questions: string[];
    answers: Answer[];
}

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            socket: undefined,
            owner: undefined,
            players: [this.props.player],
            stage: 'lobby',
            questions: [],
            answers: []
        };

        this.handleConnect = this.handleConnect.bind(this);
        this.handleRegisterResponse = this.handleRegisterResponse.bind(this);
        this.handleReceivePlayerList = this.handleReceivePlayerList.bind(this);
        this.handleStartGame = this.handleStartGame.bind(this);
        this.handleNewAnswer = this.handleNewAnswer.bind(this);
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
        console.log(data.questions);
        this.setState({ questions: data.questions });
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

    private getStageBody(stage: GameStages) {
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
                    return <Question questions={this.state.questions} socket={this.state.socket} />;
                case 'voting':
                    return (
                        <Voting
                            answers={this.state.answers}
                            player={this.props.player}
                            socket={this.state.socket}
                        />
                    );
                default:
                    return <p>ERROR</p>;
            }
        } else {
            return <></>;
        }
    }
}
