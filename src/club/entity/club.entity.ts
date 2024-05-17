import { ManyToMany, JoinTable, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SocioEntity } from 'src/socio/entity/socio.entity';

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    private name: string;

    @Column()
    private foundationDate: Date;

    @Column()
    private image: string;

    @Column()
    private description: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubs)
    @JoinTable()
    socios: SocioEntity[];

    public getDesciption(): string {
        return this.description;
    }

}
