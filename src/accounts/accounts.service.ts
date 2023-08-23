import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { RoleEnum } from 'src/etc/enums';
import {
  getGoogleDriveFileID,
  getGoogleDriveUrl,
} from 'src/etc/google-drive-url';
import { GoogleApiService } from 'src/google-api/google-api.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly googleApiService: GoogleApiService,
  ) {}
  async getByID(id: string) {
    return await this.accountRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getByUsername(username: string) {
    return await this.accountRepository.findOne({
      where: { username: username.trim().toLowerCase() },
    });
  }

  async getAllStudents() {
    return await this.accountRepository.find({
      where: {
        role: RoleEnum.STUDENT,
      },
    });
  }

  async searchStudentsByName(keyword: string) {
    return await this.accountRepository.find({
      where: {
        role: RoleEnum.STUDENT,
        name: Like(`%${keyword}%`),
      },
    });
  }

  async updateName(selfID: string, name: string) {
    try {
      const update = await this.accountRepository.update(selfID, {
        name,
      });
      if (update.affected == 0) return [null, 'Account not found'];
    } catch (error) {
      return [null, 'Account not found'];
    }
    return [true, null];
  }

  async updateAvatar(self: Account, avatar: Express.Multer.File) {
    if (self.avatarUrl && getGoogleDriveFileID(self.avatarUrl)) {
      this.googleApiService.deleteFileById(
        getGoogleDriveFileID(self.avatarUrl),
      );
    }
    const fileUpload = await this.googleApiService.uploadFile(avatar);
    if (!fileUpload) return [null, 'Error while uploading file'];
    self.avatarUrl = getGoogleDriveUrl(fileUpload.id);
    await this.accountRepository.save(self);
    return [self, null];
  }
}
