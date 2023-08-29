import { PartialType } from '@nestjs/swagger';
import { CreateQuestionNumberDto } from './create-question-number.dto';

export class UpdateQuestionNumberDto extends PartialType(CreateQuestionNumberDto) {}
