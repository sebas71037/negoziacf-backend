import { Request, Response } from 'express';
import { validate } from 'class-validator';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt-nodejs';

/* Libs */
import { ErrorManage } from '@libs/error-manage';

/* Entities */
import { User } from '../entity/user-entity';

/* Business logics */
import { UserBusinessLogic } from '../bl/user-bl';

/* Handlers */
import { apiErrorHandler } from '@handler/error-handler';

/**
 * Utils
 */
import { Validation } from '@utils/Validation';
import { Not } from 'typeorm';

export class UserController {
  /* `UserBusinessLogic` object */
  user: UserBusinessLogic;

  constructor() {
    this.user = new UserBusinessLogic();
  }

  async getAll(req: Request, res: Response) {
    const userList = await this.user.getBy({});

    res.status(200).json({
      data: {
        userList,
      },
    });
  }

  async getPagination(req: Request, res: Response) {
    try {
      const currentUserKey: string = 'user';
      const currentUser: User = req[currentUserKey];
      const query: any = req.query;
      // const page: number = +(req.query.page || 1);
      // const search: string = (req.query.search || '') as string;
      // const field: string = (req.query.field || '') as string;
      const [userList, count] = await this.user.getPagination(
        query,
        { _id: { $not: { $in: [currentUser._id] } } },
      );
      const targetUserList = userList.map((user) => {
        delete user.password;
        return user;
      });
      res.status(200).json({
        data: { count, userList: targetUserList },
      });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userBody = req.body;
      const user = new User();
      user.name = userBody.name;
      user.lastname = userBody.lastname;
      user.email = userBody.email;
      user.sex = userBody.sex;
      user.password = userBody.password;
      user.phone = userBody.phone;
      user.phoneTypeId = userBody.phoneTypeId;
      user.password = await this.user.getHash(userBody.password);

      if (!Validation.isEmail(user.email)) {
        throw new ErrorManage(403, 'invalid-email', 'invalid-email');
      }

      const emailExist = await this.user.getBy({ email: user.email });
      if (emailExist.length > 0) {
        throw new ErrorManage(403, 'user-email-exist', 'Email exist');
      }

      const newUser = await this.user.create(user);

      res.status(201).json({
        data: { user: newUser },
      });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }

  async updateById(req: Request, res: Response) {
    try {
      const targetKey: string = 'targetUser';
      const user: User = req[targetKey];
      const userBody: User = req.body;

      user.name = userBody.name;
      user.lastname = userBody.lastname;
      user.email = userBody.email;
      user.sex = userBody.sex;
      user.phone = userBody.phone;
      user.phoneTypeId = userBody.phoneTypeId;

      const emailExist = await this.user.getBy({ email: userBody.email });
      if (emailExist.length > 0 && user.email !== emailExist[0].email) {
        throw new ErrorManage(403, 'user-email-exist', 'Email exist');
      }

      if (
        userBody.password &&
        !bcrypt.compareSync(userBody.password, user.password)
      ) {
        user.password = await this.user.getHash(userBody.password);
      }

      const updateUser = await this.user.update(user);

      res.status(200).json({
        data: { user: updateUser },
      });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user: User = req['targetUser'];
      await this.user.delete(user);
      res.status(200).json({ user });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }

}
