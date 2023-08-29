import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class StudentRoomDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  roomID: number;

  @ApiProperty()
  studentID: string;
}
