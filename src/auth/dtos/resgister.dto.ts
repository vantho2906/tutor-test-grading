import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'vantho123',
  })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
    message: 'Username only contains normal letters and numbers',
  })
  @Length(3, 30)
  username: string;

  @ApiProperty({ example: '1' })
  @Length(1, 50)
  password: string;

  @ApiProperty({ example: '1' })
  @Length(1, 50)
  confirmPassword: string;

  @ApiProperty({ example: 'Van Tho' })
  @IsNotEmpty()
  @Length(3, 30)
  name: string;
}
