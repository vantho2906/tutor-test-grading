import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { In, Repository } from 'typeorm';
import { Submit } from 'src/submits/entities/submit.entity';
import { ToggleAssignRoomForStudentsDto } from './dto/toggle-assign-room-for-students.dto';
import { Assignee } from 'src/assignees/entities/assignee.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { RoleEnum, RoomFilterTypeEnum, RoomTypeEnum } from 'src/etc/enums';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { File } from 'src/files/entities/file.entity';
import { getGoogleDriveUrl } from 'src/etc/google-drive-url';
import { TopicImage } from 'src/topic-images/entities/topicImage.entity';

@Injectable()
export class RoomsService {
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
  ) {}
  async createRoom(createRoomDto: CreateRoomDto) {
    const { type, name, maxSubmitTime, open, deadline, duration } =
      createRoomDto;
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 7);
    const openTime = new Date(Date.parse(open.toString()));
    const deadlineTime = new Date(Date.parse(deadline.toString()));
    if (deadlineTime.getTime() < currentTime.getTime()) {
      return [null, 'Deadline must be after current time'];
    }
    if (openTime.getTime() > deadlineTime.getTime()) {
      return [null, 'Open time must be before deadline'];
    }
    const room = await this.roomRepository.save({
      type,
      name,
      maxSubmitTime,
      open,
      deadline,
      duration,
    });
    return [room, null];
  }

  async updateRoom(updateRoomDto: UpdateRoomDto) {
    const { id, type, name, maxSubmitTime, open, deadline, duration } =
      updateRoomDto;
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 7);
    const openTime = new Date(Date.parse(open.toString()));
    const deadlineTime = new Date(Date.parse(deadline.toString()));
    if (deadlineTime.getTime() < currentTime.getTime()) {
      return [null, 'Deadline must be after current time'];
    }
    if (openTime.getTime() > deadlineTime.getTime()) {
      return [null, 'Open time must be before deadline'];
    }
    const room = await this.getRoomByID(id);
    if (!room) return [null, 'Room not found'];
    if (room.type != type) {
      const submit = await this.submitRepository.findOne({
        where: {
          room: { id },
        },
      });
      if (submit)
        return [
          null,
          'Can not update type of room because of already having submission',
        ];
    }
    room
      .setName(name)
      .setOpen(open)
      .setDeadline(deadline)
      .setDuration(duration)
      .setMaxSubmitTime(maxSubmitTime)
      .setType(type);
    await this.roomRepository.save(room);
    return [room, null];
  }

  async deleteRoom(roomID: number) {
    const result = await this.roomRepository.update(
      { id: roomID, isDeleted: false },
      { isDeleted: true },
    );
    if (result.affected == 0) return [null, 'Room not found'];
    return [true, null];
  }

  async assignRoomForStudents(
    assignRoomForStudentsDto: ToggleAssignRoomForStudentsDto,
  ) {
    const { roomID, studentIDList } = assignRoomForStudentsDto;
    const room = await this.getRoomByID(roomID);
    if (!room) return [null, 'Room not found'];
    const alreadyAssignees = await this.assigneeRepository.find({
      where: {
        room: { id: roomID },
        student: { id: In(studentIDList) },
      },
    });
    if (alreadyAssignees.length != 0) {
      return [null, 'Some students have been already assigned'];
    }
    const newAssignees = studentIDList.map((studentID) => {
      return { room: { id: roomID }, student: { id: studentID } };
    });
    const result = await this.assigneeRepository.save(newAssignees);
    return [result, null];
  }

  async cancelAssignRoomForStudents(
    cancelAssignRoomForStudentsDto: ToggleAssignRoomForStudentsDto,
  ) {
    const { roomID, studentIDList } = cancelAssignRoomForStudentsDto;
    const room = await this.getRoomByID(roomID);
    if (!room) return [null, 'Room not found'];
    const alreadyAssignees = await this.assigneeRepository.find({
      where: {
        room: { id: roomID },
        student: { id: In(studentIDList) },
      },
    });
    if (alreadyAssignees.length != studentIDList.length) {
      return [null, 'Some students have been already canceled'];
    }
    await this.assigneeRepository.delete({
      room: { id: roomID },
      student: { id: In(studentIDList) },
    });
    return [true, null];
  }

  async createTopicImages(roomID: number, files: Express.Multer.File[]) {
    const room = await this.getRoomByID(roomID);
    if (!room) return [null, 'Room not found'];
    if (room.type == RoomTypeEnum.MULTIPLE_CHOICE_COMPLEX)
      return [null, 'Can not create for room type multiple choice complex'];
    const topicImages = [];
    for (const file of files) {
      const uploadedFile = await this.googleApiService.uploadFile(file);
      const fileEntity = new File();
      fileEntity.fileIdOnDrive = getGoogleDriveUrl(uploadedFile.id);
      topicImages.push({ ...fileEntity, room: { id: roomID } });
    }
    const data = await this.topicImageRepository.save(topicImages);
    return [data, null];
  }

  async seeTopicImages(self: Account, roomID: number) {
    const room = await this.getRoomByID(roomID);
    if (!room) return [null, 'Room not found'];
    if (self.role == RoleEnum.STUDENT) {
      const assignee = await this.assigneeRepository.findOne({
        where: {
          room: { id: roomID },
          student: { id: self.id },
        },
      });
      if (!assignee) return [null, 'You does not be assigned this room'];
    }
    const topicImages = await this.topicImageRepository.find({
      where: {
        room: { id: roomID },
      },
      relations: {
        file: true,
      },
      order: {
        file: { createdAt: 'ASC' },
      },
    });
    return [topicImages, null];
  }

  async filterRooms(self: Account, roomFilterType: RoomFilterTypeEnum) {
    switch (roomFilterType) {
      case RoomFilterTypeEnum.ALL:
        return [await this.getAllRoomsAssigned(self.id), null];
        break;
      case RoomFilterTypeEnum.SUBMITTED:
        return [await this.getRoomsAssignedThatSubmitted(self.id), null];
        break;
      case RoomFilterTypeEnum.NOT_SUBMITTED_YET:
        return [await this.getRoomsAssignedThatNotSubmitted(self.id), null];
        break;
      case RoomFilterTypeEnum.GRADED:
        return [await this.getRoomsAssignedThatSubmitsAreGraded(self.id), null];
        break;
      case RoomFilterTypeEnum.NOT_GRADED_YET:
        return [
          await this.getRoomsAssignedThatSubmitsAreNotGraded(self.id),
          null,
        ];
        break;
      default:
        return [null, 'Type is not valid'];
        break;
    }
  }

  async getAllRoomsAssigned(studentID: string) {
    return await this.roomRepository
      .createQueryBuilder('room')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('assignee.roomId')
          .from(Assignee, 'assignee')
          .where('assignee.studentId = :studentId', { studentId: studentID })
          .getQuery();
        return 'room.id in' + subQuery;
      })
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }

  async getRoomsAssignedThatSubmitted(studentID: string) {
    return await this.roomRepository
      .createQueryBuilder('room')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('submit.roomId')
          .from(Submit, 'submit')
          .where('submit.studentId = :studentId', { studentId: studentID })
          .getQuery();
        return 'room.id in' + subQuery;
      })
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }

  async getRoomsAssignedThatNotSubmitted(studentID: string) {
    return await this.roomRepository
      .createQueryBuilder('room')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('submit.roomId')
          .from(Submit, 'submit')
          .where('submit.studentId = :studentId', { studentId: studentID })
          .getQuery();
        return 'room.id not in' + subQuery;
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('assignee.roomId')
          .from(Assignee, 'assignee')
          .where('assignee.studentId = :studentId', { studentId: studentID })
          .getQuery();
        return 'room.id in ' + subQuery;
      })
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }

  async getRoomsAssignedThatSubmitsAreGraded(studentID: string) {
    return await this.roomRepository
      .createQueryBuilder('room')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('submit.roomId')
          .from(Submit, 'submit')
          .where('submit.studentId = :studentId and submit.score is not null', {
            studentId: studentID,
          })
          .getQuery();
        return 'room.id in' + subQuery;
      })
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }

  async getRoomsAssignedThatSubmitsAreNotGraded(studentID: string) {
    return await this.roomRepository
      .createQueryBuilder('room')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('submit.roomId')
          .from(Submit, 'submit')
          .where('submit.studentId = :studentId and submit.score is null', {
            studentId: studentID,
          })
          .getQuery();
        return 'room.id in' + subQuery;
      })
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }

  async getRoomByID(roomID: number) {
    return await this.roomRepository.findOne({
      where: {
        id: roomID,
        isDeleted: false,
      },
    });
  }
}
