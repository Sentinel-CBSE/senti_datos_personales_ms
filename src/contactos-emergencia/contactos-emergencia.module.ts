import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoEmergencia } from './entities/contacto-emergencia.entity';
import { ContactosEmergenciaService } from './contactos-emergencia.service';
import {
  ContactosEmergenciaController,
  PersonaContactosEmergenciaController,
} from './contactos-emergencia.controller';
import { PersonasModule } from '../personas/personas.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactoEmergencia]), PersonasModule],
  controllers: [PersonaContactosEmergenciaController, ContactosEmergenciaController],
  providers: [ContactosEmergenciaService],
})
export class ContactosEmergenciaModule {}
