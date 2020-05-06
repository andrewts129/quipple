import { Player } from './model/player';
import { PlayerListDto } from './dto/incoming/PlayerListDto';
import { RegisterDto } from './dto/outgoing/RegisterDto';
import { StartRequestDto } from './dto/outgoing/StartRequestDto';

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
        document.getElementById('waitingMessage').style.display = 'none';
    }
};

const handleStartGameFromServer = (): void => {
    const changeCountdownMessage = (seconds: number): void => {
        const message = `The game is starting in ${seconds}...`;
        document.getElementById('countdownMessage').innerText = message;
    };

    const toggleLobbyVisibility = (): void => {
        const lobbyElements = document.getElementsByClassName('lobby');
        Array.prototype.forEach.call(lobbyElements, (element: HTMLElement) => {
            element.style.display = 'none';
        });

        const questionElements = document.getElementsByClassName('question');
        Array.prototype.forEach.call(questionElements, (element: HTMLElement) => {
            element.style.display = 'block';
        });
    };

    changeCountdownMessage(3);
    setTimeout(() => changeCountdownMessage(2), 1000);
    setTimeout(() => changeCountdownMessage(1), 2000);
    setTimeout(toggleLobbyVisibility, 3000);
};

const handleStartGameButtonClick = (socket: SocketIOClient.Socket): void => {
    socket.emit('start', { jwt: thisPlayerJwt() } as StartRequestDto);
};

const main = (): void => {
    const socket = io('/gameplay');
    socket.on('connect', () => {
        socket.emit('register', { gameId: thisGameId(), jwt: thisPlayerJwt() } as RegisterDto);

        socket.on('newPlayerList', handleReceivePlayerList);
        socket.on('start', handleStartGameFromServer);

        const startGameButton = document.getElementById('startGameButton');
        startGameButton.addEventListener('click', () => handleStartGameButtonClick(socket));
    });
};

main();
