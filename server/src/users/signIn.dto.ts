import { IsString } from 'class-validator';
import { isValidPhoneNumber } from '../customValidators/isValidPhoneNumber.validator';
export default class signInDto {
	@IsString({ message: 'Phone number is not valid' })
	@isValidPhoneNumber('phoneNumber')
	phoneNumber: string;
}
