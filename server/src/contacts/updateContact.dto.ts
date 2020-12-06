import { Max, Min, IsString } from 'class-validator';

export default class updateContactDto {
	@IsString({ message: 'Name must be a string' })
	@Min(3, { message: 'Name must be greater than 2 letters' })
	@Max(15, { message: 'Name must be lower than 16 letters' })
	newName: number;
}
