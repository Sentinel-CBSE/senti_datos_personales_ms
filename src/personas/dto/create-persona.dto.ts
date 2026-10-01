import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { TipoSangre } from '../../common/enums/tipo-sangre.enum';
import { FactorRh } from '../../common/enums/factor-rh.enum';

export class CreatePersonaDto {
  @ApiProperty({ description: 'Firebase UID del usuario', example: 'abc123XYZdef456GHIjkl789MNO' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 128)
  id: string;

  @ApiProperty({ example: 'Maria Fernanda Gomez' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  nombre: string;

  @ApiProperty({ example: 'maria.gomez@example.com' })
  @IsEmail()
  correo: string;

  @ApiPropertyOptional({ enum: TipoSangre, example: TipoSangre.O })
  @IsEnum(TipoSangre)
  @IsOptional()
  tipoSangre?: TipoSangre;

  @ApiPropertyOptional({ enum: FactorRh, example: FactorRh.POSITIVO })
  @IsEnum(FactorRh)
  @IsOptional()
  factorRh?: FactorRh;

  @ApiPropertyOptional({ example: 'SURA' })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  eps?: string;
}
