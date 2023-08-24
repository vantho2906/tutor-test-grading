import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { In, Repository } from 'typeorm';
import { Submit } from 'src/submits/entities/submit.entity';
import { ToggleAssignRoomForStudentsDto } from './dto/toggle-assign-room-for-students.dto';
import { Assignee } from 'src/assignees/entities/assignee.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Assignee)
    private readonly assigneeRepository: Repository<Assignee>,
    @InjectRepository(Submit)
    private readonly submitRepository: Repository<Submit>,
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

  async getRoomByID(roomID: number) {
    return await this.roomRepository.findOne({
      where: {
        id: roomID,
        isDeleted: false,
      },
    });
  }
}
