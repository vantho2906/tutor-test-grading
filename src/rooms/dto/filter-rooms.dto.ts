import { ApiProperty } from '@nestjs/swagger';
import { RoomFilterTypeEnum } from 'src/etc/enums';

export class FilterRoomsDto {
  @ApiProperty({
    type: 'enum',
    enum: RoomFilterTypeEnum,
    example: RoomFilterTypeEnum.SUBMITTED,
  })
  type: RoomFilterTypeEnum;
}
