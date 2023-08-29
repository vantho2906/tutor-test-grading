import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

const deadline = new Date();
deadline.setHours(new Date().getHours() + 7);

export class ToggleAssignRoomForStudentsDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  roomID: number;

  @ApiProperty({ example: [] })
  @IsNotEmpty()
  @IsArray()
  studentIDList: string[];
}
