import * as _ from 'lodash';
import * as DateAndTime from 'date-and-time';

export class Dates {
  /**
  * Get current date on month
  */
  static getCurrentDateOnMonth(): Date {
    const targetDate = new Date();
    targetDate.setDate(1);
    targetDate.setHours(0);
    targetDate.setMinutes(0);
    targetDate.setSeconds(0);
    targetDate.setMilliseconds(0);
    return targetDate;
  }

  /**
  * Get current date on month
  */
  static getCurrentDateOnYear(): Date {
    const targetDate = new Date();
    targetDate.setMonth(0);
    targetDate.setDate(1);
    targetDate.setHours(0);
    targetDate.setMinutes(0);
    targetDate.setSeconds(0);
    targetDate.setMilliseconds(0);
    return targetDate;
  }

  /**
  * Get age value from date object
  * @param: date: Date object
  */
  static getAgeFromDate(date: Date | string): number {
    const birthday = _.isString(date) ? new Date(date) : date;
    return Dates.calculateAge(birthday);
  }

  /**
  * Calculate age from date object
  * @param birthday: Date object or string value
  */
  static calculateAge(birthday: Date | string): number {
    const birthdayTarget = new Date(birthday);
    const result: number = (Date.now() - birthdayTarget.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return parseFloat(result.toFixed(2));
  }

  /**
  * To local time
  * @param date: Date client
  * @param serverDate: Server date
  */
  static toLocalTime(date: Date, serverDate: Date): Date {
    const offset = (serverDate.getTimezoneOffset() * 60000) * -1;
    const n = new Date(date.getTime() + offset);
    return n;
  }

  /**
  * To format
  * @param date: Date object
  * @param format: Format date
  */
  static toFormat(date: Date, format: string = 'MM-DD-YYYY HH:mm', utc: boolean = true): string {
    return DateAndTime.format(date, format, utc);
  }

}
