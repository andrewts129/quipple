import { Player } from './model/player';
import { PlayerListDto } from './dto/PlayerListDto';

const thisGameId = (): string => window.location.pathname.split('/')[1];

const thisPlayer = (): Player => {
    const playerList = document.getElementById('playerList');
    return {
        id: parseInt(playerList.dataset.thisPlayerId),
        screenName: playerList.dataset.thisPlayerName
    };
};

const handleReceivePlayerList = (response: PlayerListDto): void => {
    const playerList = document.getElementById('playerList');

    // Remove all child nodes
    while (playerList.firstChild) {
        playerList.removeChild(playerList.lastChild);
    }

    response.players.forEach((player: Player) => {
        const listElement = document.createElement('li');
        listElement.innerText = player.screenName;
        playerList.appendChild(listElement);
    });
};

const main = (): void => {
    const player = thisPlayer();

    const socket = io('/lobby');
    socket.on('connect', () => {
        socket.emit('register', { gameId: thisGameId(), player });
        socket.on('newPlayerList', handleReceivePlayerList);
    });
};

main();
