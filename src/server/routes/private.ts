import { Router } from 'express';

/**
 * Policy
 */
import { SessionPolicy } from '../policy/session-policy';

/**
 * Routes
 */
import { UserRoutes } from '@api/user/route/user-route';

export class Private {
  static init(): Router {
    const router = Router();
    this.initPolicies(router);
    UserRoutes.init(router);
    return router;
  }

  /**
   * Initialize policy list
   * @param router: Express.Router object
   */
  static initPolicies(router: Router): void {
    router.use(SessionPolicy.init);
  }
}
