import { Player } from '../player/player.entity';
import { Entity, Column, ManyToOne, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Game {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Player, { eager: true })
    owner: Player;

    @ManyToMany(() => Player, { eager: true, cascade: true })
    @JoinTable()
    players: Player[];

    @Column('simple-json')
    questions: string[];
}
