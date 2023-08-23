import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NormalLoginDto {
  @ApiProperty({
    example: 'vantho123',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  password: string;
}
