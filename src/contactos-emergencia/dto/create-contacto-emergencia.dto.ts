import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateContactoEmergenciaDto {
  @ApiProperty({ example: 'Carlos Gomez' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  nombre: string;

  @ApiProperty({ example: '+573001234567' })
  @IsString()
  @Matches(/^\+?[0-9]{7,20}$/, {
    message: 'telefono debe ser un numero valido (7 a 20 digitos, opcionalmente con +)',
  })
  telefono: string;

  @ApiProperty({ example: 'Hermano' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  parentesco: string;
}
