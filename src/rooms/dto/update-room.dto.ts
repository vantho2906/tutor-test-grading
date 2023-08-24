import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { RoomTypeEnum } from 'src/etc/enums';
import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

const deadline = new Date();
deadline.setHours(new Date().getHours() + 7);

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  id: number;
}
