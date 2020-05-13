import { Player } from '../player/player.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

export type GameStage = 'lobby' | 'starting' | 'question';

@Entity()
export class Game {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Player, { eager: true })
    owner: Player;

    // TODO super broken
    @Column('simple-array')
    @ManyToOne(() => Player, { eager: true })
    players: Player[];

    @Column()
    stage: GameStage;
}
