import { Controller } from '@nestjs/common';
import { TopicImagesService } from './topic-images.service';

@Controller('topic-images')
export class TopicImagesController {
  constructor(private readonly topicImagesService: TopicImagesService) {}
}
