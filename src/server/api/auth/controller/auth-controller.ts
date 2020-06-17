import { Request, Response } from 'express';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt-nodejs';

/* Libs */
import { ErrorManage } from '@libs/error-manage';

/* Entities */
import { User } from '@api/user/entity/user-entity';

/* Business logics */
import { AuthBusinessLogic } from '../bl/auth-bl';
import { UserBusinessLogic } from '../../user/bl/user-bl';

/* Handlers */
import { apiErrorHandler } from '@handler/error-handler';

/**
 * Constants
 */
import { clientConst } from '@constants/client';

/* Utils */
import { Validation } from '@utils/Validation';

export class AuthController {

  /* Business logic */
  auth: AuthBusinessLogic;
  user: UserBusinessLogic;

  constructor() {
    this.auth = new AuthBusinessLogic();
    this.user = new UserBusinessLogic();
  }

  /**
   * Create session to `User` record
   */
  async login(req: Request, res: Response) {
    const PARAM_EMAIL: string = 'email';
    const PARAM_PASSWORD: string = 'password';

    if (!req.body[PARAM_EMAIL] || !req.body[PARAM_PASSWORD]) {
      throw new ErrorManage(403, 'missing-params', 'Missing params');
    }

    const email = req.body[PARAM_EMAIL];
    const password = req.body[PARAM_PASSWORD];

    try {
      const userList = await this.user.getBy({ email });
      if (userList.length === 0) {
        throw new ErrorManage(404, 'user-not-found', 'User not found');
      }
      const user = userList[0];
      if (!bcrypt.compareSync(password, user.password)) {
        throw new ErrorManage(404, 'user-not-found', 'User not found');
      }

      const token = this.auth.generateLoginToken(user);
      delete user.password;

      res.status(201).json({
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }

  /**
   * Register `User` record
   */
  async register(req: Request, res: Response) {
    try {
      const userBody = req.body;
      const user = new User();
      user.name = userBody.name;
      user.lastname = userBody.lastname;
      user.email = userBody.email;
      user.sex = userBody.sex;
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
      const token = this.auth.generateLoginToken(user);
      delete newUser.password;

      res.status(201).json({
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }

}
