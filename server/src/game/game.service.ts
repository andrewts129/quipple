import { Injectable } from '@nestjs/common';
import { Game } from './game.model';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/player.entity';

const randomGameId = (): string => {
    const randomChar = (s: string): string => s[Math.floor(Math.random() * s.length)];

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fiveRandomLetters = Array.from({ length: 5 }, () => randomChar(letters));
    return fiveRandomLetters.join('');
};

@Injectable()
export class GameService {
    constructor(private playerService: PlayerService) {}

    private games: Map<string, Game> = new Map();

    async createGame(creatorScreenName: string): Promise<Game> {
        const game = {
            id: randomGameId(),
            owner: await this.playerService.createPlayer(creatorScreenName),
            players: [],
            stage: 'lobby' as const
        };

        this.games.set(game.id, game);
        return game;
    }

    async findGame(id: string): Promise<Game | null> {
        return this.games.get(id);
    }

    async addPlayer(game: Game, player: Player): Promise<void> {
        game.players.push(player);
    }

    async removePlayer(game: Game, playerToRemove: Player): Promise<void> {
        if (playerToRemove.id === game.owner?.id) {
            game.owner = game.players.shift();
        } else {
            game.players = game.players.filter((player) => player.id !== playerToRemove.id);
        }

        // If nobody is left in the game
        if (await this.gameEmpty(game)) {
            this.games.delete(game.id);
        }
    }

    async playerInGame(game: Game, playerToFind: Player): Promise<boolean> {
        const allPlayers = [game.owner, ...game.players];
        const playerIds = allPlayers.map((player) => player.id);
        return playerIds.includes(playerToFind.id);
    }

    async gameEmpty(game: Game): Promise<boolean> {
        return !game.owner;
    }
}
