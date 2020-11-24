import mongoose from 'mongoose';

export default async (): Promise<void> => {
	const connection = await mongoose.connect(process.env.MONGO_URI!, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});

	console.log(`mongodb connected successfully: ${connection.connection.host}`);
};
