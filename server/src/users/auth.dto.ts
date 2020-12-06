import { IsInt, Max, Min, IsString } from 'class-validator';
import { isValidPhoneNumber } from '../customValidators/isValidPhoneNumber.validator';

export default class authDto {
	@IsInt({ message: 'Auth code must be a valid integer' })
	@Min(6, { message: 'Auth code must be 6 digits' })
	@Max(6, { message: 'Auth code must be 6 digits' })
	authCode: number;

	@IsString({ message: 'Phone number is not valid' })
	@isValidPhoneNumber('phoneNumber')
	phoneNumber: string;
}
