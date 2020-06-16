import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jwt-simple';

/**
 * Configurations
 */
import { JWTConfig } from '@config/jwt.conf';

/**
 * Business logi
 */
import { UserBusinessLogic } from '../api/user/bl/user-bl';

/* Libs */
import { ErrorManage } from '@libs/error-manage';

/* Handlers */
import { apiErrorHandler } from '@handler/error-handler';

/**
 * Interfaces
 */
import { IResponse } from '@interfaces/response.interface';

/**
 * Constants
 */
import { headerConst } from '@constants/header';

export class SessionPolicy {
  static async init(req: Request, res: Response, next: NextFunction) {
    const response: IResponse = {
      slug: 'invalid-token',
      message: '',
      status: 401,
    };
    let payload;
    const token = req.get(`${headerConst.PREFIX}Authorization`);

    if (!token) {
      response.message = 'Required token';
      return apiErrorHandler(
        new ErrorManage(response.status, response.slug, response.message),
        req,
        res,
      );
    }

    try {
      payload = jwt.decode(token, JWTConfig.secret);
    } catch (error) {
      response.message = 'Invalid token';
      return apiErrorHandler(
        new ErrorManage(response.status, response.slug, response.message),
        req,
        res,
      );
    }

    try {
      const userBL = new UserBusinessLogic();
      const user = await userBL.getById(payload._id);
      if (!user) {
        response.message = 'Unauthorized';
        throw new ErrorManage(response.status, response.slug, response.message);
      }
      req['user'] = user;
    } catch (error) {
      return apiErrorHandler(error, req, res);
    }

    next();
  }
}
