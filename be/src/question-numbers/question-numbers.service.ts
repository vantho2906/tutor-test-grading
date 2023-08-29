import { Injectable } from '@nestjs/common';
import { CreateQuestionNumberDto } from './dto/create-question-number.dto';
import { UpdateQuestionNumberDto } from './dto/update-question-number.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { RoomTypeEnum } from 'src/etc/enums';
import { QuestionNumber } from './entities/question-number.entity';

@Injectable()
export class QuestionNumbersService {
  constructor(
    @InjectRepository(QuestionNumber)
    private readonly questionNumberRepository: Repository<QuestionNumber>,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}
  async createQuestionNumber(roomID: number, quantity: number) {
    const room = await this.roomRepository.findOne({
      where: { id: roomID },
    });
    if (!room) return [null, 'Room not found'];
    if (
      ![
        RoomTypeEnum.MULTIPLE_CHOICE_COMPLEX,
        RoomTypeEnum.MULTIPLE_CHOICE_SIMPLE,
      ].includes(room.type)
    ) {
      return [null, 'Only support room type multiple choice'];
    }
    const questionNumber = await this.questionNumberRepository.findOne({
      where: { room: { id: roomID } },
    });
    if (questionNumber) return [null, 'Question number is already created'];
    const createQuestionNumber = await this.questionNumberRepository.create({
      room: { id: roomID },
      quantity,
    });
    await this.questionNumberRepository.save(createQuestionNumber);
    return [createQuestionNumber, null];
  }
}
