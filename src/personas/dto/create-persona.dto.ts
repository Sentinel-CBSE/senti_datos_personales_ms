import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { TipoIdentificacion } from '../../common/enums/tipo-identificacion.enum';
import { TipoSangre } from '../../common/enums/tipo-sangre.enum';
import { FactorRh } from '../../common/enums/factor-rh.enum';

export class CreatePersonaDto {
  @ApiProperty({ example: 'Maria Fernanda Gomez' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  nombre: string;

  @ApiProperty({ example: 'maria.gomez@example.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ enum: TipoIdentificacion, example: TipoIdentificacion.CC })
  @IsEnum(TipoIdentificacion)
  tipoIdentificacion: TipoIdentificacion;

  @ApiProperty({ example: '1094567890' })
  @IsString()
  @Matches(/^[A-Za-z0-9]{4,20}$/, {
    message: 'numeroIdentificacion debe contener entre 4 y 20 caracteres alfanumericos',
  })
  numeroIdentificacion: string;

  @ApiProperty({ enum: TipoSangre, example: TipoSangre.O })
  @IsEnum(TipoSangre)
  tipoSangre: TipoSangre;

  @ApiProperty({ enum: FactorRh, example: FactorRh.POSITIVO })
  @IsEnum(FactorRh)
  factorRh: FactorRh;

  @ApiProperty({
    description: 'Id de la EPS registrada en el catalogo (GET /eps)',
    example: 'b3f1a0a0-6e8a-4b1a-9c1a-0f1a2b3c4d5e',
  })
  @IsUUID()
  epsId: string;
}
