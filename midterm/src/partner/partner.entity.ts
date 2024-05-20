import { ManyToMany, JoinTable, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Club } from "../club/club.entity";

@Entity()
export class Partner {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    birthdate: Date;

    @ManyToMany(() => Club, club => club.partners)
    @JoinTable()
    @Exclude({ toPlainOnly: true })
    clubs: Club[];

}