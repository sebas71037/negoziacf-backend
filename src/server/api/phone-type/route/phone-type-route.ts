import * as express from 'express';
import { PhoneTypeController } from '../controller/phone-type-controller';

export class PhoneTypeRoutes {
  static init(router:express.Router) {
    this.initPolicies(router);

    const phoneTypeController = new PhoneTypeController();

    router
       .route('/phoneType')
       .get((req, res) => phoneTypeController.getAll(req, res));
  }

  /**
   * Initialize policy list
   * @param router: Express.Router object
   */
  static initPolicies(router: express.Router): void {}
}
