import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {
  CreateQuestionDto,
  CreateQuestionsDto,
} from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadPipe } from 'src/etc/file-upload.pipe';
import { FileTypeAllowEnum } from 'src/etc/enums';
import { log } from 'console';
import ResponseObject from 'src/etc/response-object';

@Controller('questions')
@ApiTags('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('create-questions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateQuestionsDto, required: true })
  async createQuestionsForRoom(
    @Body() createQuestionsDto: CreateQuestionsDto,
    @UploadedFiles(
      new FileUploadPipe({
        maxCount: 50,
        fileTypeAllow: Object.values(FileTypeAllowEnum),
        maxFileSize: 1024 * 1024 * 10,
      }),
    )
    files: Express.Multer.File[],
  ) {
    const [data, err] = await this.questionsService.createQuestionsForRoom(
      createQuestionsDto,
      files,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create questions failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Create questions success',
      data,
      null,
    );
  }
}
