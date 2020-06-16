import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { phoneTypeSeed } from '../../../seeds/PhoneTypeSeed';
export class SeedPhoneType1585865365900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise < any > {
    await getRepository('phone_type').save(
      phoneTypeSeed,
    );
  }

  public async down(queryRunner: QueryRunner): Promise < any > {
    const toDelete = [];
    phoneTypeSeed.forEach(phoneType => toDelete.push(phoneType._id));
    await getRepository('phone_type').delete(toDelete);
  }
}
