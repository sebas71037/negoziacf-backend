import * as express from 'express';
import { AuthController } from '../controller/auth-controller';

export class AuthRoutes {
  static init(router: express.Router) {
    const authController = new AuthController();

    router
      .route('/auth')
      .post((req, res) => authController.login(req, res));

    router
      .route('/auth/register')
      .post((req, res) => authController.register(req, res));

  }
}
