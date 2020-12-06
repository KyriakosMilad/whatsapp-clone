import { RequestHandler } from 'express';
import asyncHandler from '../middlewares/asyncHandler.middleware';
import HttpException from '../utils/HttpException';
import ContactSchema from './contacts.schema';
import { findUserByPhoneNumber } from '../users/users.controller';
import { IContact } from './contacts.schema';

/**
 * @desc			Find contact by id
 * @access		DEV METHOD
 */
export const findContactById = async (
	id: string
): Promise<IContact | undefined> => {
	try {
		// find contact
		const contact = await ContactSchema.findById(id);

		// if contact not found return undefined
		if (!contact) return undefined;

		return contact;
	} catch {
		return undefined;
	}
};

/**
 * @desc			Create new contact
 * @access		AUTH
 */
export const createContact: RequestHandler = asyncHandler(
	async (req, res, next) => {
		// check if phone number exist
		const user = await findUserByPhoneNumber(req.body.phoneNumber);

		if (!user)
			return next(new HttpException('Phone number is not signed with us', 422));

		// create contact
		const contact = await ContactSchema.create({
			ownerId: req.user._id,
			userId: user._id,
			name: req.body.name,
		});

		res.status(200).json({
			success: true,
			message: 'Contact created successfully',
		});
	}
);

/**
 * @desc			Get all auth user contacts with pagination
 * @access		AUTH
 */
export const getContacts: RequestHandler = asyncHandler(
	async (req, res, next) => {
		// get auth contacts
		const authContacts = ContactSchema.find({ ownerId: req.user._id });

		// pagination
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit = 25;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const total = await authContacts.countDocuments();

		const contacts = await authContacts.skip(startIndex).limit(limit);

		// pagination result
		const pagination: {
			next?: number;
			prev?: number;
		} = {};

		if (endIndex < total) pagination.next = page + 1;

		if (startIndex > 0) pagination.prev = page - 1;

		res.status(200).json({
			success: true,
			data: contacts,
			pagination,
		});
	}
);

/**
 * @desc			Update contact
 * @access		AUTH
 */
export const updateContact: RequestHandler = asyncHandler(
	async (req, res, next) => {
		// find contact by id
		const contact = await findContactById(req.params.id);

		// check if contact exist
		if (!contact)
			return next(new HttpException('No contact exist with this id', 422));

		// check if contact belongs to auth user
		if (contact.ownerId != req.user._id)
			return next(
				new HttpException(
					'Auth does not have privileges to do this action',
					403
				)
			);

		// update contact
		await contact.updateOne({ name: req.body.newName });

		return res.status(200).json({
			success: true,
			message: 'Contact updated successfully',
		});
	}
);

/**
 * @desc			Delete contact
 * @access		AUTH
 */
export const deleteContact: RequestHandler = asyncHandler(
	async (req, res, next) => {
		// find contact by id
		const contact = await findContactById(req.params.id);

		// check if contact exist
		if (!contact)
			return next(new HttpException('No contact exist with this id', 422));

		// check if contact belongs to auth user
		if (contact.ownerId != req.user._id)
			return next(
				new HttpException(
					'Auth does not have privileges to do this action',
					403
				)
			);

		// delete contact
		await contact.deleteOne();

		return res.status(200).json({
			success: true,
			message: 'Contact deleted successfully',
		});
	}
);
