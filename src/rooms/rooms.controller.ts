import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import ResponseObject from 'src/etc/response-object';
import { ToggleAssignRoomForStudentsDto } from './dto/toggle-assign-room-for-students.dto';

@Controller('rooms')
@ApiTags('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Post('create-room')
  @ApiBody({ type: CreateRoomDto, required: true })
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    const [data, err] = await this.roomService.createRoom(createRoomDto);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create room failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Create room success', data, null);
  }

  @Post('update-room')
  @ApiBody({ type: UpdateRoomDto, required: true })
  async updateRoom(@Body() udpdateRoomDto: UpdateRoomDto) {
    const [data, err] = await this.roomService.updateRoom(udpdateRoomDto);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update room failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Update room success', data, null);
  }

  @Get('delete-room/:roomID')
  async deleteRoom(@Param('roomID', ParseIntPipe) roomID: number) {
    const [data, err] = await this.roomService.deleteRoom(roomID);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Delete room failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Delete room success', data, null);
  }

  @Get('get-a-room/:id')
  async getRoomByID(@Param('id', ParseIntPipe) id: number) {
    return await this.roomService.getRoomByID(id);
  }

  @Post('assign-room-for-students')
  @ApiBody({ type: ToggleAssignRoomForStudentsDto, required: true })
  async assignRoomForStudents(
    @Body() assignRoomForStudentsDto: ToggleAssignRoomForStudentsDto,
  ) {
    const [data, err] = await this.roomService.assignRoomForStudents(
      assignRoomForStudentsDto,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Assign room failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Assign room success', data, null);
  }

  @Post('cancel-assign-room-for-students')
  @ApiBody({ type: ToggleAssignRoomForStudentsDto, required: true })
  async cancelAssignRoomForStudents(
    @Body() cancelAssignRoomForStudentsDto: ToggleAssignRoomForStudentsDto,
  ) {
    const [data, err] = await this.roomService.cancelAssignRoomForStudents(
      cancelAssignRoomForStudentsDto,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Cancel assign room failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Cancel assign room success',
      data,
      null,
    );
  }
}
