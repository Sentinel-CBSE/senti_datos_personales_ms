import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PersonasService } from './personas.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { FindPersonasQueryDto } from './dto/find-personas-query.dto';

@ApiTags('Personas (Interno)')
@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar los datos personales de una persona' })
  create(@Body() dto: CreatePersonaDto) {
    return this.personasService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar/buscar personas (uso interno de otros microservicios)',
  })
  findAll(@Query() query: FindPersonasQueryDto) {
    return this.personasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle completo de una persona' })
  findOne(@Param('id') id: string) {
    return this.personasService.findOne(id);
  }

  @Get(':id/info-robo')
  @ApiOperation({
    summary:
      'Informacion resumida para el microservicio de reporte de robos: datos basicos + ' +
      'contactos de emergencia a notificar',
  })
  getInfoParaRobo(@Param('id') id: string) {
    return this.personasService.getInfoParaRobo(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar los datos personales de una persona' })
  update(@Param('id') id: string, @Body() dto: UpdatePersonaDto) {
    return this.personasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Desactivar una persona (soft delete: no se elimina el registro para conservar el ' +
      'historial de robos asociado)',
  })
  deactivate(@Param('id') id: string) {
    return this.personasService.deactivate(id);
  }
}
