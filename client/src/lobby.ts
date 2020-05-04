import { Player } from './model/player';
import { PlayerListDto } from './dto/PlayerListDto';

const thisGameId = (): string => window.location.pathname.split('/')[1];

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
    const socket = io('/lobby');

    socket.on('connect', () => {
        socket.emit('joinRoom', { gameId: thisGameId() });
        socket.on('newPlayerList', handleReceivePlayerList);
    });
};

main();
