import { Player } from '../player/player.entity';
import { Entity, ManyToOne, PrimaryColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Round } from '../round/round.entity';

@Entity()
export class Game {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Player, { eager: true })
    owner: Player;

    @ManyToMany(() => Player, { eager: true, cascade: true })
    @JoinTable()
    players: Player[];

    @OneToMany(() => Round, (round) => round.game, { eager: true, cascade: true })
    rounds: Round[];
}
