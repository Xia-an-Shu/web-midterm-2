import { ManyToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Partner } from "../partner/partner.entity";

@Entity()
export class Club {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    foundationDate: Date;

    @Column()
    image: string;

    @Column()
    description: string;

    @ManyToMany(() => Partner, partner => partner.clubs)
    @Exclude({ toPlainOnly: true })
    partners: Partner[];

}
