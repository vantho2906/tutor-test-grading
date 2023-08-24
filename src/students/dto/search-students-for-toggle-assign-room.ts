import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SearchStudentsForToggleAssignRoomDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  roomID: number;

  @ApiProperty({ example: 'tho' })
  @IsNotEmpty()
  name: string;
}
