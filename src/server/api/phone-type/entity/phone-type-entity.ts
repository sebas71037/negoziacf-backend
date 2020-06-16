import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  ObjectIdColumn,
} from 'typeorm';
import { Length } from 'class-validator';

/**
 * Entities
 */
import { User } from '@api/user/entity/user-entity';

@Entity()
export class PhoneType extends BaseEntity{
  @ObjectIdColumn()
  // tslint:disable-next-line: variable-name
  _id: number;

  @Column({ length: 100 })
  @Length(4, 100)
  name: string;

  @OneToMany(
    () => User,
    user => user.phoneType,
  )
  userList: User[];

  @Column('date', {
    name: 'created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;

  @Column('date', {
    name: 'updated',
    nullable: true,
  })
  updated: Date;

}
