import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	buildMessage,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function isValidPhoneNumber(
	property: string,
	validationOptions?: ValidationOptions
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isValidPhoneNumber',
			target: object.constructor,
			propertyName: propertyName,
			validator: {
				validate(value: any) {
					const parsed = parsePhoneNumberFromString(value);
					if (!parsed) return false;
					return true;
				},
				defaultMessage: buildMessage((eachPrefix) => {
					return 'Phone number is not valid';
				}),
			},
		});
	};
}
