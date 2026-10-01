import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserUpdateBodyDto } from './dto/user-update-body.dto';
import { EmergencyContactRequestDto } from './dto/emergency-contact-request.dto';

@ApiTags('Usuarios (Móvil)')
@ApiBearerAuth()
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  @ApiOperation({ summary: 'Crear o actualizar el perfil del usuario autenticado (upsert)' })
  updateProfile(
    @Headers('authorization') auth: string,
    @Body() dto: UserUpdateBodyDto,
  ) {
    const { uid, email } = this.usersService.extractFirebaseInfo(auth);
    return this.usersService.upsertProfile(uid, email, dto);
  }

  @Post('emergency-contacts')
  @ApiOperation({ summary: 'Agregar un contacto de emergencia al usuario autenticado' })
  addEmergencyContact(
    @Headers('authorization') auth: string,
    @Body() dto: EmergencyContactRequestDto,
  ) {
    const { uid, email } = this.usersService.extractFirebaseInfo(auth);
    return this.usersService.addEmergencyContact(uid, email, dto);
  }

  @Put('emergency-contacts/:uid')
  @ApiOperation({ summary: 'Actualizar un contacto de emergencia' })
  updateEmergencyContact(
    @Param('uid', ParseUUIDPipe) contactId: string,
    @Body() dto: EmergencyContactRequestDto,
  ) {
    return this.usersService.updateEmergencyContact(contactId, dto);
  }

  @Delete('emergency-contacts/:uid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un contacto de emergencia' })
  deleteEmergencyContact(
    @Param('uid', ParseUUIDPipe) contactId: string,
  ) {
    return this.usersService.deleteEmergencyContact(contactId);
  }
}
