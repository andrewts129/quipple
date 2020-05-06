import { RegisterDto } from './dto/outgoing/RegisterDto';
import { thisPlayerJwt, thisGameId, thisPlayer } from './utils';
import { handleStartGameFromServer, handleStartGameButtonClick } from './lobbyStage';
import { handleSubmitAnswerButtonClick, handleNewQuestion } from './questionStage';
import { PlayerListDto } from './dto/incoming/PlayerListDto';
import { Player } from './model/player';

export const handleReceivePlayerList = (data: PlayerListDto): void => {
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
