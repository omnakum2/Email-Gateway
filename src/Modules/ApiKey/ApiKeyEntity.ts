import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../Common/Entities/BaseEntity';
import { Status } from '../../Common/Enums/Status';
import { ApiKeyType } from '../../Common/Enums/ApiKeyType';
import { UserEntity } from '../User/UserEntity';

@Entity()
export class ApiKeyEntity extends BaseEntity {
  @Column({ type: 'varchar', default: ApiKeyType.Secret })
  type: ApiKeyType;

  @Column()
  keyPrefix: string;

  @Column()
  keyHash: string;

  @Column({ type: 'varchar', default: Status.Active })
  status: Status;

  @Column({ type: 'datetime', nullable: true })
  lastUsedAt: Date;

  @ManyToOne(() => UserEntity, (consumer) => consumer.apiKeys, { onDelete: 'CASCADE' })
  consumer: UserEntity;
}
