import { Player } from '../player/player.entity';
import { Entity, Column, ManyToOne, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';

export type GameStage = 'lobby' | 'starting' | 'question' | 'voting';

@Entity()
export class Game {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Player, { eager: true })
    owner: Player;

    @ManyToMany(() => Player, { eager: true, cascade: true })
    @JoinTable()
    players: Player[];

    @Column()
    stage: GameStage;

    @Column('simple-json')
    questions: string[];
}
