import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../Common/Entities/BaseEntity';
import { UserType } from '../../Common/Enums/UserType';
import { ApiKeyEntity } from '../ApiKey/ApiKeyEntity';
import { Status } from '../../Common/Enums/Status';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    enum: UserType,
    default: UserType.CONSUMER,
  })
  userType: UserType;

  @Column({
    type: 'varchar',
    enum: Status,
    default: Status.Active,
  })
  status: Status;

  @Column({ default: 'Email Gateway' })
  defaultFromName: string;

  @Column({ default: 'support@email-gateway.com' })
  defaultReplyToEmail: string;

  @Column({ default: 'Powered by Email Gateway' })
  footerText: string;

  @Column('simple-array', { default: ["'http://localhost:3000'"] })
  allowedOrigins: string[];

  @OneToMany(() => ApiKeyEntity, (apiKey) => apiKey.consumer)
  apiKeys: ApiKeyEntity[];
}
