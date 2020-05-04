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
            players: [],
            state: 'New' as const
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

    async removePlayer(game: Game, playerToRemove: Player): Promise<void> {
        game.players = game.players.filter(
            (player) => !this.playerService.playersEqual(playerToRemove, player)
        );
    }

    async allPlayers(game: Game): Promise<Player[]> {
        return [game.creator, ...game.players];
    }

    async playerInGame(game: Game, playerToFind: Player): Promise<boolean> {
        for (const playerInGame of await this.allPlayers(game)) {
            if (this.playerService.playersEqual(playerToFind, playerInGame)) {
                return true;
            }
        }

        return false;
    }
}
