import { FileUploadPipe } from './../etc/file-upload.pipe';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import ResponseObject from 'src/etc/response-object';
import { ToggleAssignRoomForStudentsDto } from './dto/toggle-assign-room-for-students.dto';
import { FilterRoomsDto } from './dto/filter-rooms.dto';
import CurrentAccount from 'src/decorators/current-account.decorator';
import { Account } from 'src/accounts/entities/account.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateTopicImagesDto } from './dto/create-topic-images.dto';
import { FileTypeAllowEnum } from 'src/etc/enums';

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

  @Get('filter-rooms/:type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async filterRooms(
    @Param() filterRoomsDto: FilterRoomsDto,
    @CurrentAccount() self: Account,
  ) {
    const [data, err] = await this.roomService.filterRooms(
      self,
      filterRoomsDto.type,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Filter rooms failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Filter rooms success',
      data,
      null,
    );
  }

  @Post('create-topic-images')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTopicImagesDto })
  async createTopicImages(
    @UploadedFiles(
      new FileUploadPipe({
        maxCount: 10,
        fileTypeAllow: Object.values(FileTypeAllowEnum),
        maxFileSize: 1024 * 1024 * 10,
      }),
    )
    files: Express.Multer.File[],
    @CurrentAccount() self: Account,
    @Body() createTopicImagesDto: CreateTopicImagesDto,
  ) {
    const [data, err] = await this.roomService.createTopicImages(
      +createTopicImagesDto.roomID,
      files,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create topic images failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Create topic images success',
      data,
      null,
    );
  }

  @Get('see-topic-images/:roomID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async seeTopicImages(
    @Param('roomID', ParseIntPipe) roomID: number,
    @CurrentAccount() self: Account,
  ) {
    const [data, err] = await this.roomService.seeTopicImages(self, roomID);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'See topic images failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'See topic images success',
      data,
      null,
    );
  }
}
