import { PhoneType } from '../entity/phone-type-entity';
import { Like } from 'typeorm';

/**
 * Constants
 */
import { paginationConst } from '@constants/pagination';

export class PhoneTypeBusinessLogic {
  constructor() {}

  async getBy(query: object = {}): Promise<PhoneType[]> {
    const phoneTypeList = await PhoneType.find(query);
    return phoneTypeList;
  }

  async getById(phoneTypeId: number): Promise<PhoneType> {
    const phoneType = await PhoneType.findOne(phoneTypeId);
    return phoneType;
  }

  async create(phoneTypeData: PhoneType): Promise<PhoneType> {
    const newPhoneType = await phoneTypeData.save();
    return newPhoneType;
  }

  async update(phoneTypeData: PhoneType): Promise<object> {
    const phoneType = await phoneTypeData.save();
    return phoneType;
  }

  async delete(phoneType: PhoneType): Promise<boolean> {
    await phoneType.remove();
    return true;
  }

}
