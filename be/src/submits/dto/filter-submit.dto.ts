import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { SubmitFilterTypeEnum } from 'src/etc/enums';

export class FilterSubmitDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  roomID: number;

  @ApiProperty({
    enum: SubmitFilterTypeEnum,
    example: SubmitFilterTypeEnum.ALL,
  })
  @IsEnum(SubmitFilterTypeEnum)
  type: SubmitFilterTypeEnum;
}
