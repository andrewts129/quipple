import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Player } from '../player/player.entity';
import { Round } from './round.entity';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Player, { eager: true })
    player: Player;

    @Column()
    text: string;

    @ManyToOne(() => Round)
    round: Round;
}
