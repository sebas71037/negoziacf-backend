import { Router } from 'express';

/**
 * Routes
 */
import { AuthRoutes } from '@api/auth/route/auth-route';
import { PhoneTypeRoutes } from '@api/phone-type/route/phone-type-route';

export class Public {
  static init(): Router {
    const router = Router();
    AuthRoutes.init(router);
    PhoneTypeRoutes.init(router);
    return router;
  }
}
