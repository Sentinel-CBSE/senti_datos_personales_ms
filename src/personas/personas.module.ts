import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { ContactoEmergencia } from '../contactos-emergencia/entities/contacto-emergencia.entity';
import { PersonasService } from './personas.service';
import { PersonasController } from './personas.controller';
import { EpsModule } from '../eps/eps.module';

@Module({
  imports: [TypeOrmModule.forFeature([Persona, ContactoEmergencia]), EpsModule],
  controllers: [PersonasController],
  providers: [PersonasService],
  exports: [PersonasService],
})
export class PersonasModule {}
