import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignee } from 'src/assignees/entities/assignee.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { IsNull, Not, Raw, Repository } from 'typeorm';
import { Submit } from './entities/submit.entity';
import { TopicImage } from 'src/topic-images/entities/topicImage.entity';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { File } from 'src/files/entities/file.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoomTypeEnum, SubmitFilterTypeEnum } from 'src/etc/enums';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class SubmitsService {
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
    private readonly googleApiService: GoogleApiService,
    private readonly accountsService: AccountsService,
  ) {}
  async gradeSubmit(submitID: number, score: number) {
    const result = await this.submitRepository.update(submitID, {
      score,
    });
    if (result.affected == 0) return [null, 'Submit not found'];
    return [true, null];
  }

  async startDoingTest(roomID: number, studentID: string) {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomID,
      },
    });
    if (!room) return [null, 'Room not found'];
    const student = await this.accountsService.getByID(studentID);
    if (!student) return [null, 'Student not found'];
    if (room.open > new Date()) return [null, 'Room is not open yet'];
    if (room.deadline < new Date()) return [null, 'Room is already closed'];
    if (room.type == RoomTypeEnum.HOMEWORK) {
      const submit = await this.submitRepository.findOne({
        where: { room: { id: roomID }, student: { id: studentID } },
      });
      if (submit) return [null, 'You can only submit 1 time'];
    }
    const numberOfSubmitsOfStudentInRoom =
      await this.getNumberOfSubmitsOfStudentInRoom(roomID, studentID);
    if (numberOfSubmitsOfStudentInRoom >= room.maxSubmitTime)
      return [null, 'Exceed number of submits'];
    const isStudentInDoingProgressInThatRoom =
      await this.isStudentInDoingProgressInThatRoom(roomID, studentID);
    if (isStudentInDoingProgressInThatRoom) {
      return [
        null,
        'Can not start new test because of having another test in progress',
      ];
    }
    const submit = this.submitRepository.create({
      student: { id: studentID },
      room: { id: roomID },
    });
    await this.submitRepository.save(submit);
    return [submit, null];
  }

  async submitTheTest(roomID: number, submitID: number) {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomID,
      },
    });
    if (!room) return [null, 'Room not found'];
    const submit = await this.getSubmitByID(submitID);
    if (!submit) return [null, 'Submit not found'];
  }

  async filterSubmitsInRoom(roomID: number, type: SubmitFilterTypeEnum) {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomID,
      },
    });
    if (!room) return [null, 'Room not found'];
    switch (type) {
      case SubmitFilterTypeEnum.ALL:
        return [await this.getAllSubmitsInRoom, null];
        break;
      case SubmitFilterTypeEnum.GRADED:
        return [await this.getGradedSubmitsInRoom, null];
        break;
      case SubmitFilterTypeEnum.NOT_GRADED_YET:
        return [await this.getNotGradedSubmitsInRoom, null];
        break;
      default:
        break;
    }
  }

  async getGradedSubmitsInRoom(roomID: number) {
    const submits = await this.submitRepository.find({
      where: {
        room: { id: roomID },
        score: Raw((alias) => `${alias} IS NOT NULL`),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return submits;
  }

  async getNotGradedSubmitsInRoom(roomID: number) {
    const submits = await this.submitRepository.find({
      where: {
        room: { id: roomID },
        score: Raw((alias) => `${alias} IS NULL`),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return submits;
  }

  async getAllSubmitsInRoom(roomID: number) {
    const submits = await this.submitRepository.find({
      where: {
        room: { id: roomID },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return submits;
  }

  async isStudentInDoingProgressInThatRoom(roomID: number, studentID: string) {
    const currentTime = new Date().getTime();
    const room = await this.roomRepository.findOne({
      where: {
        id: roomID,
      },
    });
    if (!room) return false;
    const submit = await this.submitRepository
      .createQueryBuilder('submit')
      .innerJoin('submit.room', 'room', 'room.id = :roomID', { roomID: roomID })
      .innerJoin('submit.account', 'student', 'student.id = :studentID', {
        studentID,
      })
      .where('submit.submittedAt is null and room.deadline > :now', {
        now: new Date(),
      })
      .andWhere('room.duration is null or submit.createdAt < :minCreatedAt', {
        minCreatedAt: new Date(currentTime - room.duration),
      })
      .getOne();
    if (submit) return true;
    return false;
  }

  async getNumberOfSubmitsOfStudentInRoom(roomID: number, studentID: string) {
    const numberOfSubmits = await this.submitRepository
      .createQueryBuilder('submit')
      .where('submit.roomId = :roomID', { roomID })
      .andWhere('submit.studentId = :studentID', { studentID })
      .getCount();

    return numberOfSubmits;
  }

  async getSubmitByID(submitID: number) {
    const submit = await this.submitRepository.findOne({
      where: {
        id: submitID,
      },
    });
    return submit;
  }
}
