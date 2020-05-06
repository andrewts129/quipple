import { setClassDisplay, thisPlayerJwt } from './utils';
import { StartRequestDto } from './dto/outgoing/StartRequestDto';
import { showNextQuestion } from './questionStage';

export const handleStartGameButtonClick = (socket: SocketIOClient.Socket): void => {
    socket.emit('start', { jwt: thisPlayerJwt() } as StartRequestDto);
};

export const handleStartGameFromServer = (): void => {
    const changeCountdownMessage = (seconds: number): void => {
        const message = `The game is starting in ${seconds}...`;
        document.getElementById('countdownMessage').innerText = message;
    };

    const makeQuestionStageVisible = (): void => {
        setClassDisplay('lobbyStage', 'none');
        setClassDisplay('questionStage', 'block');
    };

    changeCountdownMessage(3);
    setTimeout(() => changeCountdownMessage(2), 1000);
    setTimeout(() => changeCountdownMessage(1), 2000);
    setTimeout(makeQuestionStageVisible, 3000);
    setTimeout(showNextQuestion, 3000);
};
