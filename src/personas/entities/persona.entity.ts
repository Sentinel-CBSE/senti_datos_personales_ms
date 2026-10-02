import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipoSangre } from '../../common/enums/tipo-sangre.enum';
import { FactorRh } from '../../common/enums/factor-rh.enum';
import { ContactoEmergencia } from '../../contactos-emergencia/entities/contacto-emergencia.entity';

@Entity('personas')
export class Persona {
  @PrimaryColumn({ type: 'nvarchar', length: 128 })
  id: string;

  @Column({ type: 'varchar', length: 2, name: 'tipo_sangre', nullable: true })
  tipoSangre: TipoSangre | null;

  @Column({ type: 'varchar', length: 1, name: 'factor_rh', nullable: true })
  factorRh: FactorRh | null;

  @Column({ type: 'nvarchar', length: 150, nullable: true })
  eps: string | null;

  @OneToMany(() => ContactoEmergencia, (contacto) => contacto.persona)
  contactosEmergencia: ContactoEmergencia[];

  @CreateDateColumn({ type: 'datetime2', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2', name: 'updated_at' })
  updatedAt: Date;
}
