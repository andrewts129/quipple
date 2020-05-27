import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from 'typeorm';
import { Player } from '../player/player.entity';
import { Round } from '../round/round.entity';

@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Round, (round) => round.votes)
    round: Round;

    @Column()
    forPlayerId: number;

    @ManyToOne(() => Player)
    forPlayer: Player;
}
