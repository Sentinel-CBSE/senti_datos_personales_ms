import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from '../personas/entities/persona.entity';
import { ContactoEmergencia } from '../contactos-emergencia/entities/contacto-emergencia.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Persona, ContactoEmergencia])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
