import { Submit } from './../../submits/entities/submit.entity';
import { RoleEnum } from '../../etc/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Assignee } from '../../assignees/entities/assignee.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.STUDENT })
  role: RoleEnum;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => Assignee, (assignee) => assignee.student)
  assignees: Assignee[];

  @OneToMany(() => Submit, (submit) => submit.student)
  submits: Submit[];

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
