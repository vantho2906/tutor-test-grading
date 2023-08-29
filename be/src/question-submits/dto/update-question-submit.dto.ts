import { PartialType } from '@nestjs/swagger';
import { CreateQuestionSubmitDto } from './create-question-submit.dto';

export class UpdateQuestionSubmitDto extends PartialType(CreateQuestionSubmitDto) {}
