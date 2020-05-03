import { Injectable } from '@nestjs/common';
import { Game } from './game.model';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/player.model';

const randomGameId = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fiveRandomLetters = Array.from(
        { length: 5 },
        () => letters[Math.floor(Math.random() * letters.length)]
    );
    return fiveRandomLetters.join('');
};

@Injectable()
export class GameService {
    constructor(private playerService: PlayerService) {}

    private games: Set<Game> = new Set();

    async createGame(creatorScreenName: string): Promise<Game> {
        const game = {
            id: randomGameId(),
            creator: await this.playerService.createPlayer(creatorScreenName),
            players: []
        };

        this.games.add(game);
        return game;
    }

    async findGame(id: string): Promise<Game | null> {
        for (const game of this.games) {
            if (id === game.id) {
                return game;
            }
        }

        return null;
    }

    async addPlayer(game: Game, player: Player): Promise<void> {
        game.players.push(player);
    }

    async playerInGame(game: Game, playerToFind: Player): Promise<boolean> {
        const allPlayers = [game.creator, ...game.players];
        for (const playerInGame of allPlayers) {
            if (this.playerService.playersEqual(playerToFind, playerInGame)) {
                return true;
            }
        }

        return false;
    }
}
