import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { SearchStudentsForToggleAssignRoomDto } from './dto/search-students-for-toggle-assign-room';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import ResponseObject from 'src/etc/response-object';

@Controller('students')
@ApiTags('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('search-students-by-name-for-assigning-room')
  async searchStudentByNameForAssigningRoom(
    @Query()
    searchStudentsForAssignRoomDto: SearchStudentsForToggleAssignRoomDto,
  ) {
    const [data, err] =
      await this.studentsService.searchStudentByNameForAssigningRoom(
        searchStudentsForAssignRoomDto,
      );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Search students failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Search students success',
      data,
      null,
    );
  }

  @Get('search-students-by-name-for-cancel-assigning-room')
  async searchStudentByNameForCancelAssigningRoom(
    @Query()
    searchStudentsForCancelAssignRoomDto: SearchStudentsForToggleAssignRoomDto,
  ) {
    const [data, err] =
      await this.studentsService.searchStudentByNameForCancelAssigningRoom(
        searchStudentsForCancelAssignRoomDto,
      );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Search students failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Search students success',
      data,
      null,
    );
  }

  @Get('get-all')
  async findAll() {
    return await this.studentsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
