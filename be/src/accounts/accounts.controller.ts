import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import ResponseObject from 'src/etc/response-object';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import CurrentAccount from 'src/decorators/current-account.decorator';
import { Account } from './entities/account.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('get-all-students')
  async getAllStudents() {
    const result = await this.accountsService.getAllStudents();
    return new ResponseObject(
      HttpStatus.OK,
      'Get all students success',
      result,
      null,
    );
  }

  @Get('search-students-by-name')
  @ApiParam({ name: 'keyword' })
  async searchStudentsByName(@Param('keyword') keyword: string) {
    const result = await this.accountsService.searchStudentsByName(keyword);
    return new ResponseObject(
      HttpStatus.OK,
      'Search students success',
      result,
      null,
    );
  }

  @Post('update-name/:name')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'name', required: true })
  async updateName(
    @Param('name') name: string,
    @CurrentAccount() self: Account,
  ) {
    const [account, err] = await this.accountsService.updateName(self.id, name);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update name failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Update name success',
      account,
      null,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('update-avatar')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({
            fileType: 'image/jpeg|image/png|image/jpg|image/svg|image/gif',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentAccount() account: Account,
  ) {
    const [data, err] = await this.accountsService.updateAvatar(account, file);
    if (err)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update avatar failed',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Update avatar success',
      data,
      null,
    );
  }
}
