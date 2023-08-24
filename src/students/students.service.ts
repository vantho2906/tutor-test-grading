import { Account } from 'src/accounts/entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { Assignee } from 'src/assignees/entities/assignee.entity';
import { Submit } from 'src/submits/entities/submit.entity';
import { Like, Not, Repository, getConnection } from 'typeorm';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoleEnum } from 'src/etc/enums';
import { SearchStudentsForToggleAssignRoomDto } from './dto/search-students-for-toggle-assign-room';

@Injectable()
export class StudentsService {
  constructor(
    private readonly roomsService: RoomsService,

    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Assignee)
    private readonly assigneeRepository: Repository<Assignee>,
    @InjectRepository(Submit)
    private readonly submitRepository: Repository<Submit>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async searchStudentByNameForAssigningRoom(
    searchStudentsForAssignRoomDto: SearchStudentsForToggleAssignRoomDto,
  ) {
    const { roomID, name } = searchStudentsForAssignRoomDto;
    const room = await this.roomsService.getRoomByID(roomID);
    if (!room) return [null, 'Room not found'];
    const students = await this.accountRepository
      .createQueryBuilder('student')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('assignee.studentId')
          .from(Assignee, 'assignee')
          .where('assignee.roomId != :roomID', { roomID: roomID })
          .getQuery();
        return 'student.id not in' + subQuery;
      })
      .andWhere('LOWER(student.name) like :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .andWhere('student.role = :role', { role: RoleEnum.STUDENT })
      .getMany();
    return [students, null];
  }

  async searchStudentByNameForCancelAssigningRoom(
    searchStudentsForAssignRoomDto: SearchStudentsForToggleAssignRoomDto,
  ) {
    const { roomID, name } = searchStudentsForAssignRoomDto;
    const room = await this.roomsService.getRoomByID(roomID);
    if (!room) return [null, 'Room not found'];
    const students = await this.accountRepository
      .createQueryBuilder('student')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('assignee.studentId')
          .from(Assignee, 'assignee')
          .where('assignee.roomId != :roomID', { roomID: roomID })
          .getQuery();
        return 'student.id in' + subQuery;
      })
      .andWhere('LOWER(student.name) like :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .andWhere('student.role = :role', { role: RoleEnum.STUDENT })
      .getMany();
    return [students, null];
  }

  async findAll() {
    return await this.accountRepository
      .createQueryBuilder('student')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('assignee.studentId')
          .from(Assignee, 'assignee')
          .where('assignee.roomId != :roomID', { roomID: 1 })
          .getQuery();
        return 'student.id not in' + subQuery;
      })
      .andWhere('student.role = :role', { role: RoleEnum.STUDENT })
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
