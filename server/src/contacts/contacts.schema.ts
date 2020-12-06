import mongoose, { Document, model, Model } from 'mongoose';

export interface IContact extends Document {
	ownerId: string;
	userId: string;
	name: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const ContactSchema = new mongoose.Schema(
	{
		ownerId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
			unique: true,
			maxlength: 15,
			minlength: 3,
		},
	},
	{ timestamps: true }
);

const Contact: Model<IContact> = model('Contact', ContactSchema);

export default Contact;
