import { ManyToMany, JoinTable, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from 'src/club/entity/club.entity';

@Entity()
export class SocioEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  birthdate: Date;

  @ManyToMany(() => ClubEntity, club => club.socios)
  @JoinTable()
  clubs: ClubEntity[];
}
