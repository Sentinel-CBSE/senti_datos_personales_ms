import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class EmergencyContactRequestDto {
  @ApiProperty({ example: 'Laura Gomez' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name: string;

  @ApiProperty({ example: '+573001234567' })
  @IsString()
  @Matches(/^\+?[0-9]{7,20}$/, { message: 'phoneNumber debe ser un número válido' })
  phoneNumber: string;

  @ApiProperty({ example: 'Hermana' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  relationship: string;
}
