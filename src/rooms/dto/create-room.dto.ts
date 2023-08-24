import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RoomTypeEnum } from 'src/etc/enums';

const deadline = new Date();
deadline.setHours(new Date().getHours() + 7);

export class CreateRoomDto {
  @ApiProperty({
    example: RoomTypeEnum.ESSAY,
    enum: RoomTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(RoomTypeEnum)
  type: RoomTypeEnum;

  @ApiProperty({ example: 'Kiem tra li 11 giua ki 1' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  maxSubmitTime: number;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  open: Date;

  @ApiProperty({ example: deadline })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @ApiProperty({ example: 90 * 60 * 1000 })
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
