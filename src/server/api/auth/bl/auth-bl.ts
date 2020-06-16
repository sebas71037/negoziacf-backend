import * as jwt from 'jwt-simple';

/**
 * Configurations
 */
import { JWTConfig } from '@config/jwt.conf';

/**
 * Entities
 */
import { User } from '../../user/entity/user-entity';

export class AuthBusinessLogic {

  constructor() {}

  /**
   * Generate login token
   * @param user: `User` record
   */
  generateLoginToken(user: User) {
    return this.generateToken({ _id: user._id });
  }

  /**
   * Generate token
   * @param payload: Payload to encrypt
   */
  generateToken(payload: any) {
    return jwt.encode(payload, JWTConfig.secret);
  }

  /**
   * Decode token
   * @param token: Token value
   */
  decodeToken(token: string) {
    return jwt.decode(token, JWTConfig.secret);
  }
}
