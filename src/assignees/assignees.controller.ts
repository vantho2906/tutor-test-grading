import { Controller } from '@nestjs/common';
import { AssigneesService } from './assignees.service';

@Controller('assignees')
export class AssigneesController {
  constructor(private readonly assigneesService: AssigneesService) {}
}
