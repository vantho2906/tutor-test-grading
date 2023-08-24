import { PartialType } from '@nestjs/swagger';
import { CreateSubmitDto } from './create-submit.dto';

export class UpdateSubmitDto extends PartialType(CreateSubmitDto) {}
