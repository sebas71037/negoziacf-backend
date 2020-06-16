import { Request, Response, NextFunction } from 'express';

/**
 * Business logic
 */
import { UserBusinessLogic } from '../api/user/bl/user-bl';

/* Libs */
import { ErrorManage } from '@libs/error-manage';

/* Handlers */
import { apiErrorHandler } from '@handler/error-handler';

export class ExistUserPolicy {
  static async init(req: Request, res: Response, next: NextFunction) {
    console.log('In');
    const status = 404;
    try {
      const paramId: string = 'userId';
      const targetKey: string = 'targetUser';
      if (req.params[paramId] === undefined) {
        throw new ErrorManage(status, 'user-id-not-found', 'Missing params');
      }
      const userBL = new UserBusinessLogic();
      const userId = req.params[paramId];
      const user = await userBL.getById(userId);
      if (!user) {
        throw new ErrorManage(404, 'user-not-found', 'User not found');
      }
      req[targetKey] = user;
    } catch (error) {
      return apiErrorHandler(error, req, res);
    }
    next();
  }
}
