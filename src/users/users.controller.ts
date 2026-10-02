import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserUpdateBodyDto } from './dto/user-update-body.dto';
import { EmergencyContactRequestDto } from './dto/emergency-contact-request.dto';

@ApiTags('Usuarios (Móvil)')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado (lazy: crea el usuario si no existe)' })
  @ApiHeader({ name: 'x-firebase-user-id', description: 'Firebase UID del usuario autenticado', required: true })
  getProfile(
    @Headers('x-firebase-user-id') uid: string,
  ) {
    this.usersService.extractFirebaseInfo(uid);
    return this.usersService.getProfile(uid);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Actualizar datos personales del usuario (404 si no existe)' })
  @ApiHeader({ name: 'x-firebase-user-id', description: 'Firebase UID del usuario autenticado', required: true })
  updateProfile(
    @Headers('x-firebase-user-id') uid: string,
    @Body() dto: UserUpdateBodyDto,
  ) {
    this.usersService.extractFirebaseInfo(uid);
    return this.usersService.upsertProfile(uid, dto);
  }

  @Post('emergency-contacts')
  @ApiOperation({ summary: 'Agregar un contacto de emergencia al usuario autenticado' })
  @ApiHeader({ name: 'x-firebase-user-id', description: 'Firebase UID del usuario autenticado', required: true })
  addEmergencyContact(
    @Headers('x-firebase-user-id') uid: string,
    @Body() dto: EmergencyContactRequestDto,
  ) {
    this.usersService.extractFirebaseInfo(uid);
    return this.usersService.addEmergencyContact(uid, dto);
  }

  @Put('emergency-contacts/:uid')
  @ApiOperation({ summary: 'Actualizar un contacto de emergencia' })
  @ApiHeader({ name: 'x-firebase-user-id', description: 'Firebase UID del usuario autenticado', required: true })
  updateEmergencyContact(
    @Headers('x-firebase-user-id') uid: string,
    @Param('uid', ParseUUIDPipe) contactId: string,
    @Body() dto: EmergencyContactRequestDto,
  ) {
    this.usersService.extractFirebaseInfo(uid);
    return this.usersService.updateEmergencyContact(uid, contactId, dto);
  }

  @Delete('emergency-contacts/:uid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un contacto de emergencia' })
  @ApiHeader({ name: 'x-firebase-user-id', description: 'Firebase UID del usuario autenticado', required: true })
  deleteEmergencyContact(
    @Headers('x-firebase-user-id') uid: string,
    @Param('uid', ParseUUIDPipe) contactId: string,
  ) {
    this.usersService.extractFirebaseInfo(uid);
    return this.usersService.deleteEmergencyContact(uid, contactId);
  }
}
