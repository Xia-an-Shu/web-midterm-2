import { ManyToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PartnerEntity } from "../partner/partner.entity";

@Entity()
export class ClubEntity {

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

    @ManyToMany(() => PartnerEntity, partner => partner.clubs)
    partners: PartnerEntity[];

    public getDesciption(): string {
        return this.description;
    }

}
