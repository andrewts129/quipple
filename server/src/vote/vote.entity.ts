import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from 'typeorm';
import { Game } from '../game/game.entity';
import { Player } from '../player/player.entity';

@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gameId: string;

    @ManyToOne(() => Game)
    game: Game;

    @Column()
    forPlayerId: number;

    @ManyToOne(() => Player)
    forPlayer: Player;
}
