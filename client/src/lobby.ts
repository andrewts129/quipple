import { Player } from './model/player';
import { PlayerListDto } from './dto/PlayerListDto';
import { RegisterDto } from './dto/RegisterDto';

const thisGameId = (): string => window.location.pathname.split('/')[2];

const thisPlayer = (): Player => {
    const playerList = document.getElementById('playerList');
    return {
        id: parseInt(playerList.dataset.thisPlayerId),
        screenName: playerList.dataset.thisPlayerName
    };
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

    if (data.owner.id === thisPlayer().id) {
        const startGameButton = document.getElementById('startGameButton');
        startGameButton.style.display = 'block';
    }
};

const handleStartGameFromServer = (): void => {
    alert('The game is starting!');
};

const handleStartGameButtonClick = (socket: SocketIOClient.Socket): void => {
    socket.emit('start');
};

const main = (): void => {
    const player = thisPlayer();

    const socket = io('/lobby');
    socket.on('connect', () => {
        socket.emit('register', { gameId: thisGameId(), player } as RegisterDto);

        socket.on('newPlayerList', handleReceivePlayerList);
        socket.on('start', handleStartGameFromServer);

        // This button is only present for the owner
        const startGameButton = document.getElementById('startGameButton');
        if (startGameButton) {
            startGameButton.addEventListener('click', () => handleStartGameButtonClick(socket));
        }
    });
};

main();
