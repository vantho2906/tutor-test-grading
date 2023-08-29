import { Module } from '@nestjs/common';
import { TopicImagesService } from './topic-images.service';
import { TopicImagesController } from './topic-images.controller';

@Module({
  controllers: [TopicImagesController],
  providers: [TopicImagesService]
})
export class TopicImagesModule {}
