import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateQuestionChoiceDto {
  @IsNotEmpty()
  @ApiProperty({ example: '12' })
  content: string;

  @IsInt()
  @ApiProperty({ example: 1 })
  answer: number;
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'This is a new question' })
  text: string;

  @IsInt()
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  choiceNumber: number;

  @IsInt()
  @ApiProperty({ example: 3 })
  @Type(() => Number)
  answer: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionChoiceDto)
  @ApiProperty({ type: [CreateQuestionChoiceDto] })
  questionChoices: CreateQuestionChoiceDto[];
}

export class CreateQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @ApiProperty({ type: [CreateQuestionDto] })
  questions: CreateQuestionDto[];

  @IsInt()
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  roomID: number;
}
