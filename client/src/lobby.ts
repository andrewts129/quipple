const thisGameId = (): string => window.location.pathname.split('/')[1];

const handleReceivePlayerList = (response: any): void => {
    const playerList = document.getElementById('playerList');

    // Remove all child nodes
    while (playerList.firstChild) {
        playerList.removeChild(playerList.lastChild);
    }

    response.players.forEach((player: any) => {
        const listElement = document.createElement('li');
        listElement.innerText = player.screenName;
        playerList.appendChild(listElement);
    });
};

const main = (): void => {
    const socket = io();

    socket.on('connect', () => {
        socket.emit('getPlayers', { gameId: thisGameId() }, handleReceivePlayerList);
    });
};

main();
