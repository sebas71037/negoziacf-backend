import { User } from '../entity/user-entity';
import * as bcrypt from 'bcrypt-nodejs';
import { Like } from 'typeorm';
import { validate } from 'class-validator';

/**
 * Libs
 */
import { ErrorManage } from '@libs/error-manage';
import { ManagePagination } from '@libs/manage-pagination';

/**
 * Constants
 */
import { paginationConst } from '@constants/pagination';
import { FieldManage } from '@libs/field-manage';

export class UserBusinessLogic {
  constructor() {}

  async getBy(query: object = {}): Promise<User[]> {
    const userList = await User.find(query);
    return userList;
  }

  async getById(userId: string): Promise<User> {
    const user = await User.findOne(userId);
    return user;
  }

  async create(userData: User): Promise<User> {
    await FieldManage.validate(userData);
    userData.created = new Date();
    const newUser = await userData.save();
    return newUser;
  }

  async update(userData: User): Promise<User> {
    await FieldManage.validate(userData);
    userData.updated = new Date();
    const user = await userData.save();
    return user;
  }

  async delete(user: User): Promise<boolean> {
    await user.remove();
    return true;
  }

  /**
   * Get all `User` record list by filter paginatin
   * @param page: Page value
   * @param search: Search to filter
   * @param field: Field to search and filter
   * @param extraWhere: Extra where condition
   */
  async getPagination(
    /*page: number = 1,
    search: string = '',
    field: string = '',*/
    query: any,
    extraWhere = {},
  ): Promise<[User[], number]> {
    const managePagination: ManagePagination = new ManagePagination(
      query,
      extraWhere,
    );
    const user = await User.find(managePagination.getQuery());
    const countUserList = await User.find(managePagination.getQuery().where);
    return [user, countUserList.length];
  }

  /**
   * Get password hash
   * @param password: Password to hash
   */
  async getHash(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          throw new ErrorManage(403, 'invalid-password', 'Invalid password');
        }
        resolve(hash);
      });
    });
  }
}
