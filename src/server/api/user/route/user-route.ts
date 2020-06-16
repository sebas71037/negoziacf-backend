import * as express from 'express';
import { UserController } from '../controller/user-controller';

/**
 * Policies
 */
import { ExistUserPolicy } from '@policy/exist-user-policy';

export class UserRoutes {
  static init(router: express.Router) {
    this.initPolicies(router);

    const userController = new UserController();

    router
      .route('/user')
      .get((req, res) => userController.getAll(req, res))
      .post((req, res) => userController.create(req, res));

    router
      .route('/user/paginate')
      .get((req, res) => userController.getPagination(req, res));

    router
      .route('/user/:userId([0-9a-f]{24})')
      .put((req, res) => userController.updateById(req, res))
      .delete((req, res) => userController.delete(req, res));
  }

  /**
   * Initialize policy list
   * @param router: Express.Router object
   */
  static initPolicies(router: express.Router): void {
    router.use('/user/:userId([0-9a-f]{24})', ExistUserPolicy.init);
  }
}
