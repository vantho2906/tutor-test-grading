import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateQuestionsDto } from './dto/create-question.dto';
import { Room } from 'src/rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { Assignee } from 'src/assignees/entities/assignee.entity';
import { Submit } from 'src/submits/entities/submit.entity';
import { TopicImage } from 'src/topic-images/entities/topicImage.entity';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { File } from 'src/files/entities/file.entity';
import { RoomTypeEnum } from 'src/etc/enums';
import { getGoogleDriveUrl } from 'src/etc/google-drive-url';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Assignee)
    private readonly assigneeRepository: Repository<Assignee>,
    @InjectRepository(Submit)
    private readonly submitRepository: Repository<Submit>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(TopicImage)
    private readonly topicImageRepository: Repository<TopicImage>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly googleApiService: GoogleApiService,
  ) {}
  async createQuestionsForRoom(
    createQuestionsDto: CreateQuestionsDto,
    files: Express.Multer.File[],
  ) {
    const { questions, roomID } = createQuestionsDto;
    const room = await this.roomRepository.findOne({
      where: { id: roomID },
      relations: {
        questionNumber: true,
      },
    });
    if (!room) return [null, 'Room not found'];
    if (
      ![
        RoomTypeEnum.MULTIPLE_CHOICE_COMPLEX,
        RoomTypeEnum.MULTIPLE_CHOICE_SIMPLE,
      ].includes(room.type)
    ) {
      return [null, 'Room type must be multiple choice'];
    }
    if (questions.length != files.length)
      return [null, 'Questions length must be equal with images length'];
    if (questions.length != room.questionNumber.quantity) {
      return [null, 'Questions length must be equal with question number'];
    }
    const fileRecords: File[] = [];
    for (const file of files) {
      const uploadedFile = await this.googleApiService.uploadFile(file);
      const fileRecord = new File();
      fileRecord.fileIdOnDrive = getGoogleDriveUrl(uploadedFile.id);
      fileRecords.push(fileRecord);
    }
    const filesAfterSaving = await this.fileRepository.save(fileRecords);
    const questionRecords = questions.map((question, i) => {
      return {
        ...question,
        file: { id: filesAfterSaving[i].id },
        room: { id: roomID },
      };
    });
    const questionsAfterSaving = await this.questionRepository.save(
      questionRecords,
    );
    return [questionsAfterSaving, null];
  }
}
