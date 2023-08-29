import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class GradeSubmitDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  submitID: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;
}
