import { Injectable } from '@nestjs/common';
import { CreateSubmitDto } from './dto/create-submit.dto';
import { UpdateSubmitDto } from './dto/update-submit.dto';

@Injectable()
export class SubmitsService {
  create(createSubmitDto: CreateSubmitDto) {
    return 'This action adds a new submit';
  }

  findAll() {
    return `This action returns all submits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} submit`;
  }

  update(id: number, updateSubmitDto: UpdateSubmitDto) {
    return `This action updates a #${id} submit`;
  }

  remove(id: number) {
    return `This action removes a #${id} submit`;
  }
}
