import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactosEmergenciaService } from './contactos-emergencia.service';
import { CreateContactoEmergenciaDto } from './dto/create-contacto-emergencia.dto';
import { UpdateContactoEmergenciaDto } from './dto/update-contacto-emergencia.dto';

@ApiTags('contactos-emergencia')
@Controller('personas/:personaId/contactos-emergencia')
export class PersonaContactosEmergenciaController {
  constructor(private readonly contactosService: ContactosEmergenciaService) {}

  @Post()
  @ApiOperation({
    summary: 'Agregar un contacto de emergencia a una persona (disponible en cualquier momento)',
  })
  create(
    @Param('personaId', ParseUUIDPipe) personaId: string,
    @Body() dto: CreateContactoEmergenciaDto,
  ) {
    return this.contactosService.create(personaId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar los contactos de emergencia de una persona' })
  findAll(@Param('personaId', ParseUUIDPipe) personaId: string) {
    return this.contactosService.findAllByPersona(personaId);
  }
}

@ApiTags('contactos-emergencia')
@Controller('contactos-emergencia')
export class ContactosEmergenciaController {
  constructor(private readonly contactosService: ContactosEmergenciaService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un contacto de emergencia por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar un contacto de emergencia' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContactoEmergenciaDto) {
    return this.contactosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un contacto de emergencia' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.contactosService.remove(id);
  }
}
