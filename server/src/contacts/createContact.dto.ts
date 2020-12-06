import { IsInt, Max, Min, IsString } from 'class-validator';
import { isValidPhoneNumber } from '../customValidators/isValidPhoneNumber.validator';

export default class createContactDto {
	@IsString({ message: 'Name must be a string' })
	@Min(3, { message: 'Name must be greater than 2 letters' })
	@Max(15, { message: 'Name must be lower than 16 letters' })
	name: number;

  @IsString({ message: 'Phone number is not valid' })
	@isValidPhoneNumber('phoneNumber')
	phoneNumber: string;
}
