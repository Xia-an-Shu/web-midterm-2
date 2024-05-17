import { ManyToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SocioEntity } from 'src/socio/entity/socio.entity';

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
    public description: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubs)
    socios: SocioEntity[];

    public static getDesciption(obj): string {
        return obj.description;
    }

}
