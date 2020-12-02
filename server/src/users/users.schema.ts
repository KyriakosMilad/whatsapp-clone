import mongoose, { Document, model, Model } from 'mongoose';

export interface IUser extends Document {
	phoneNumber: string;
	region: string;
	authCode?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

const UserSchema = new mongoose.Schema(
	{
		phoneNumber: {
			type: String,
			unique: true,
			required: true,
			maxlength: 15,
		},
		region: {
			type: String,
			required: true,
			maxlength: 3,
		},
		authCode: Number,
	},
	{ timestamps: true }
);

const User: Model<IUser> = model('User', UserSchema);

export default User;
