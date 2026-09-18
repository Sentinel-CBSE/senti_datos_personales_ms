import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindPersonasQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por numero de identificacion exacto' })
  @IsOptional()
  @IsString()
  numeroIdentificacion?: string;

  @ApiPropertyOptional({ description: 'Filtrar por correo exacto' })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiPropertyOptional({
    description: 'Si es false, incluye tambien las personas desactivadas',
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  soloActivas?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
