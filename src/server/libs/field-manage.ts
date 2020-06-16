import { validate } from 'class-validator';

/* Libraries */
import { ErrorManage } from './error-manage';

export class FieldManage {

  /**
   * Validate field constraints of records
   * @param data: Data object to store or update
   */
  static async validate(data: any) {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new ErrorManage(
        400,
        ''.concat(
          errors[0].property,
          '-',
          Object.keys(errors[0].constraints)[0],
        ),
        '',
      );
    }
  }
}
