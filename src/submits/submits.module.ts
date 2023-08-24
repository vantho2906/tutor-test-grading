import { Module } from '@nestjs/common';
import { SubmitsService } from './submits.service';
import { SubmitsController } from './submits.controller';

@Module({
  controllers: [SubmitsController],
  providers: [SubmitsService]
})
export class SubmitsModule {}
