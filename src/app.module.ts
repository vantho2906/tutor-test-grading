import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import AppDataSource from './database/datasource';
import { AuthModule } from './auth/auth.module';
import { GoogleApiModule } from './google-api/google-api.module';
import { RoomsModule } from './rooms/rooms.module';
import { AssigneesModule } from './assignees/assignees.module';
import { SubmitsModule } from './submits/submits.module';
import { StudentsModule } from './students/students.module';
import { TopicImagesModule } from './topic-images/topic-images.module';
import { FilesModule } from './files/files.module';
import { QuestionNumbersModule } from './question-numbers/question-numbers.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionChoicesModule } from './question-choices/question-choices.module';
import { QuestionSubmitsModule } from './question-submits/question-submits.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AccountsModule,
    AuthModule,
    GoogleApiModule,
    RoomsModule,
    AssigneesModule,
    SubmitsModule,
    StudentsModule,
    TopicImagesModule,
    FilesModule,
    QuestionNumbersModule,
    QuestionsModule,
    QuestionChoicesModule,
    QuestionSubmitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
