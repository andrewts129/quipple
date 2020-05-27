import {
    PrimaryGeneratedColumn,
    Entity,
    ManyToOne,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Vote } from '../vote/vote.entity';
import { Game } from '../game/game.entity';
import { Player } from '../player/player.entity';
import { Answer } from './answer.entity';

@Entity()
export class Round {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Game, (game) => game.rounds)
    game: Game;

    @Column()
    gameId: string;

    @Column()
    question: string;

    @Column()
    active: boolean;

    @OneToMany(() => Answer, (answer) => answer.round)
    answers: Answer[];

    @OneToMany(() => Vote, (vote) => vote.round)
    votes: Vote[];

    @ManyToMany(() => Player)
    @JoinTable()
    readyToEnd: Player[];
}
