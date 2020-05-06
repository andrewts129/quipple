import { Player } from './model/player';
import { PlayerListDto } from './dto/incoming/PlayerListDto';
import { RegisterDto } from './dto/outgoing/RegisterDto';
import { StartRequestDto } from './dto/outgoing/StartRequestDto';
import { NewQuestionDto } from './dto/incoming/NewQuestionDto';

const state = {
    questionQueue: [] as string[]
};

const thisGameId = (): string => window.location.pathname.split('/')[2];

const thisPlayer = (): Player => {
    const playerList = document.getElementById('playerList');
    return {
        id: parseInt(playerList.dataset.thisPlayerId),
        screenName: playerList.dataset.thisPlayerName
    };
};

const thisPlayerJwt = (): string => {
    const allCookies = document.cookie;
    const jwtCookie = allCookies.split(';').find((s) => s.startsWith('jwt'));
    if (jwtCookie) {
        return jwtCookie.replace('jwt=', '');
    } else {
        alert('Authentication token not found');
    }
};

const setClassDisplay = (className: string, display: string): void => {
    const elements = document.getElementsByClassName(className);
    Array.prototype.forEach.call(elements, (element: HTMLElement) => {
        element.style.display = display;
    });
};

const handleReceivePlayerList = (data: PlayerListDto): void => {
    const playerList = document.getElementById('playerList');

    // Remove all child nodes
    while (playerList.firstChild) {
        playerList.removeChild(playerList.lastChild);
    }

    [data.owner, ...data.players].forEach((player: Player) => {
        const listElement = document.createElement('li');
        listElement.innerText = player.screenName;
        playerList.appendChild(listElement);
    });

    document.getElementById('ownerName').innerText = data.owner.screenName;

    if (data.owner.id === thisPlayer().id) {
        document.getElementById('startGameButton').style.display = 'block';
        document.getElementById('startWaitingMessage').style.display = 'none';
    }
};

const popNextFromQuestionQueue = async (): Promise<string> => {
    // TODO deal with the possibility of queue being empty
    return state.questionQueue.shift();
};

const showNextQuestion = async (): Promise<void> => {
    const question = await popNextFromQuestionQueue();
    document.getElementById('question').innerText = question;
};

const handleStartGameFromServer = (): void => {
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

const handleStartGameButtonClick = (socket: SocketIOClient.Socket): void => {
    socket.emit('start', { jwt: thisPlayerJwt() } as StartRequestDto);
};

const handleNewQuestion = (data: NewQuestionDto): void => {
    state.questionQueue.push(data.question);
};

const handleSubmitAnswerButtonClick = (socket: SocketIOClient.Socket): void => {
    const answer = (document.getElementById('answerTextInput') as HTMLInputElement).value;
    socket.emit('submitAnswer', { answer, jwt: thisPlayerJwt() });

    document.getElementById('mySubmission').innerText = answer;
    setClassDisplay('questionStage-presubmit', 'none');
    setClassDisplay('questionStage-postsubmit', 'block');
};

const main = (): void => {
    const socket = io('/gameplay');
    socket.on('connect', () => {
        socket.emit('register', { gameId: thisGameId(), jwt: thisPlayerJwt() } as RegisterDto);

        socket.on('newPlayerList', handleReceivePlayerList);
        socket.on('start', handleStartGameFromServer);
        socket.on('newQuestion', handleNewQuestion);

        const startGameButton = document.getElementById('startGameButton');
        startGameButton.addEventListener('click', () => handleStartGameButtonClick(socket));

        const submitAnswerButton = document.getElementById('submitAnswerButton');
        submitAnswerButton.addEventListener('click', () => handleSubmitAnswerButtonClick(socket));
    });
};

main();
