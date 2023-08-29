import { Module } from '@nestjs/common';
import { AssigneesService } from './assignees.service';
import { AssigneesController } from './assignees.controller';

@Module({
  controllers: [AssigneesController],
  providers: [AssigneesService]
})
export class AssigneesModule {}
