import { ManyToMany, JoinTable, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ClubEntity } from "../club/club.entity";

@Entity()
export class PartnerEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    birthdate: Date;

    @ManyToMany(() => ClubEntity, club => club.partners)
    @JoinTable()
    clubs: ClubEntity[];

}