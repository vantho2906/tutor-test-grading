import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { SubmitsService } from './submits.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GradeSubmitDto } from './dto/grade-submit.dto';
import { RoleEnum } from 'src/etc/enums';
import ResponseObject from 'src/etc/response-object';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { FilterSubmitDto } from './dto/filter-submit.dto';
import { StudentRoomDto } from './dto/student-room.dto';

@Controller('submits')
@ApiTags('submits')
export class SubmitsController {
  constructor(private readonly submitsService: SubmitsService) {}
  @Post('grade-submit')
  @ApiBody({ type: GradeSubmitDto, required: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async gradeSubmit(@Body() gradeSubmitDto: GradeSubmitDto) {
    const { submitID, score } = gradeSubmitDto;
    const [data, err] = await this.submitsService.gradeSubmit(
      +submitID,
      +score,
    );
    if (err)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Grade submit failed',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Grade submit success',
      data,
      null,
    );
  }

  @Get('filter-submits')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @UseGuards(RoleEnum.ADMIN)
  async filterSubmitsInRoom(@Param() filterSubmitDto: FilterSubmitDto) {
    const { roomID, type } = filterSubmitDto;
    const [data, err] = await this.submitsService.filterSubmitsInRoom(
      +roomID,
      type,
    );
    if (err)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Filter submits failed',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Filter submits success',
      data,
      null,
    );
  }

  @Post('start-doing-test')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: StudentRoomDto, required: true })
  // @UseGuards(RoleEnum.STUDENT)
  async startDoingTest(@Body() studentRoomDto: StudentRoomDto) {
    const { roomID, studentID } = studentRoomDto;
    const [data, err] = await this.submitsService.startDoingTest(
      +roomID,
      studentID,
    );
    if (err)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Start doing test failed',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Start doing test success',
      data,
      null,
    );
  }
}
