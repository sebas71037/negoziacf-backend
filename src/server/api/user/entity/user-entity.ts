import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import { Length } from 'class-validator';
import { PhoneType } from '@api/phone-type/entity/phone-type-entity';

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  // tslint:disable-next-line: variable-name
  _id: ObjectID;

  @Column({ length: 100 })
  @Length(4, 100)
  name: string;

  @Column({ length: 100 })
  @Length(4, 100)
  lastname: string;

  @Column({ length: 250 })
  @Length(6, 250)
  email: string;

  @Column({ type: 'tinyint', default: 0 })
  sex: number;

  @Column({ length: 250 })
  @Length(6, 250)
  password: string;

  @Column({ length: 45 })
  @Length(7, 45)
  phone: string;

  @Column()
  phoneTypeId: number;

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

  @ManyToOne(() => PhoneType, (phoneType: PhoneType) => phoneType.userList)
  @JoinColumn([{ name: 'phoneTypeId' }])
  phoneType: PhoneType;

}
