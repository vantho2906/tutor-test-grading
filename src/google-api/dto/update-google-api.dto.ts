import { PartialType } from '@nestjs/swagger';
import { CreateGoogleApiDto } from './create-google-api.dto';

export class UpdateGoogleApiDto extends PartialType(CreateGoogleApiDto) {}
