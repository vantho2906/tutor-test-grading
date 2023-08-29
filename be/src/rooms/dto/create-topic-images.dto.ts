import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

const deadline = new Date();
deadline.setHours(new Date().getHours() + 7);

export class CreateTopicImagesDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  roomID: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files: string[];
}
