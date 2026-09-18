import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EpsService } from './eps.service';

@ApiTags('eps')
@Controller('eps')
export class EpsController {
  constructor(private readonly epsService: EpsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar el catalogo de EPS activas' })
  findAll() {
    return this.epsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una EPS por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.epsService.findOne(id);
  }
}
