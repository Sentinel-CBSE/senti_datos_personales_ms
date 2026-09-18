import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Persona } from '../../personas/entities/persona.entity';

@Entity('eps')
export class Eps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'nvarchar', length: 150, unique: true })
  nombre: string;

  @Column({ type: 'bit', default: true })
  activo: boolean;

  @OneToMany(() => Persona, (persona) => persona.eps)
  personas: Persona[];
}
