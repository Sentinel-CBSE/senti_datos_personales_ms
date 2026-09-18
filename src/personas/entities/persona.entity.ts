import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipoIdentificacion } from '../../common/enums/tipo-identificacion.enum';
import { TipoSangre } from '../../common/enums/tipo-sangre.enum';
import { FactorRh } from '../../common/enums/factor-rh.enum';
import { Eps } from '../../eps/entities/eps.entity';
import { ContactoEmergencia } from '../../contactos-emergencia/entities/contacto-emergencia.entity';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', length: 150 })
  nombre: string;

  @Column({ type: 'nvarchar', length: 150, unique: true })
  correo: string;

  @Column({ type: 'varchar', length: 3, name: 'tipo_identificacion' })
  tipoIdentificacion: TipoIdentificacion;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'numero_identificacion' })
  numeroIdentificacion: string;

  @Column({ type: 'varchar', length: 2, name: 'tipo_sangre' })
  tipoSangre: TipoSangre;

  @Column({ type: 'varchar', length: 1, name: 'factor_rh' })
  factorRh: FactorRh;

  @Column({ type: 'uniqueidentifier', name: 'eps_id' })
  epsId: string;

  @ManyToOne(() => Eps, (eps) => eps.personas, { eager: true })
  @JoinColumn({ name: 'eps_id' })
  eps: Eps;

  @OneToMany(() => ContactoEmergencia, (contacto) => contacto.persona)
  contactosEmergencia: ContactoEmergencia[];

  @Column({ type: 'bit', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'datetime2', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2', name: 'updated_at' })
  updatedAt: Date;
}
