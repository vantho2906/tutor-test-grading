import { RoleEnum } from '../../etc/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
