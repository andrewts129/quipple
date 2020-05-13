import { Injectable, NotFoundException } from '@nestjs/common';
import { Game, GameStage } from './game.entity';
import { PlayerService } from '../player/player.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const randomGameId = (): string => {
    const randomChar = (s: string): string => s[Math.floor(Math.random() * s.length)];

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fiveRandomLetters = Array.from({ length: 5 }, () => randomChar(letters));
    return fiveRandomLetters.join('');
};

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        private playerService: PlayerService
    ) {}

    async createGame(creatorScreenName: string): Promise<Game> {
        const game = {
            id: randomGameId(),
            owner: await this.playerService.createPlayer(creatorScreenName),
            players: [],
            stage: 'lobby' as const
        };

        return this.gameRepository.save(game);
    }

    async findGame(id: string): Promise<Game> {
        const game = await this.gameRepository.findOne({ id });
        if (game) {
            // TODO get rid of this?
            if (!game.players) {
                game.players = [];
            }
            return game;
        } else {
            throw new NotFoundException(`Game with id ${id} not found`);
        }
    }

    async addPlayer(gameId: string, playerId: number): Promise<Game> {
        const [game, player] = await Promise.all([
            this.findGame(gameId),
            this.playerService.findPlayer(playerId)
        ]);

        const newPlayerList = [...game.players, player];
        return this.gameRepository.save({ id: game.id, players: newPlayerList });
    }

    async removePlayer(gameId: string, playerId: number): Promise<Game | null> {
        const game = await this.findGame(gameId);

        if (playerId === game.owner.id) {
            if (game.players.length > 0) {
                const [newOwner, ...newPlayerList] = game.players;
                return this.gameRepository.save({
                    id: game.id,
                    owner: newOwner,
                    players: newPlayerList
                });
            } else {
                return this.gameRepository.remove(game);
            }
        } else {
            const newPlayerList = game.players.filter((p) => p.id !== playerId);
            return this.gameRepository.save({ id: gameId, players: newPlayerList });
        }
    }

    async playerInGame(gameId: string, playerId: number): Promise<boolean> {
        const game = await this.findGame(gameId);
        const playerIds = [game.owner, ...game.players].map((p) => p.id);
        return playerIds.includes(playerId);
    }

    async changeStage(gameId: string, stage: GameStage): Promise<Game> {
        const game = await this.findGame(gameId);
        return this.gameRepository.save({ id: game.id, stage });
    }
}
