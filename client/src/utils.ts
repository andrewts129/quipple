import { Player } from './model/player';

export const thisGameId = (): string => window.location.pathname.split('/')[2];

export const thisPlayer = (): Player => {
    const playerList = document.getElementById('playerList');
    return {
        id: parseInt(playerList.dataset.thisPlayerId),
        screenName: playerList.dataset.thisPlayerName
    };
};

export const thisPlayerJwt = (): string => {
    const allCookies = document.cookie;
    const jwtCookie = allCookies.split(';').find((s) => s.startsWith('jwt'));
    if (jwtCookie) {
        return jwtCookie.replace('jwt=', '');
    } else {
        alert('Authentication token not found');
    }
};

export const setClassDisplay = (className: string, display: string): void => {
    const elements = document.getElementsByClassName(className);
    Array.prototype.forEach.call(elements, (element: HTMLElement) => {
        element.style.display = display;
    });
};
