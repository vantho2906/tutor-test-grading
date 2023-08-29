import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateQuestionNumberDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  roomID: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
