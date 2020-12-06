import mongoose, { Document, model, Model } from 'mongoose';

export interface IUser extends Document {
	phoneNumber: string;
	authCode?: number | null;
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
		authCode: Number,
	},
	{ timestamps: true }
);

const User: Model<IUser> = model('User', UserSchema);

export default User;
