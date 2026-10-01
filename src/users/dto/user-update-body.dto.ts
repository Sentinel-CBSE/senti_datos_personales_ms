import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserUpdateBodyDto {
  @ApiPropertyOptional({ example: 'Maria Fernanda Gomez' })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ enum: ['POSITIVE', 'NEGATIVE'] })
  @IsEnum(['POSITIVE', 'NEGATIVE'])
  @IsOptional()
  bloodTypeRh?: 'POSITIVE' | 'NEGATIVE';

  @ApiPropertyOptional({ enum: ['A', 'B', 'AB', 'O'] })
  @IsEnum(['A', 'B', 'AB', 'O'])
  @IsOptional()
  bloodTypeLetter?: 'A' | 'B' | 'AB' | 'O';

  @ApiPropertyOptional({ example: 'SURA' })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  eps?: string;
}
