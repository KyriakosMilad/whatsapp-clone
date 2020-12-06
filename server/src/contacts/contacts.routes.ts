import express from 'express';
import validationErrorHandler from '../middlewares/validationErrorHandler';
import createContactDto from './createContact.dto';
import updateContactDto from './updateContact.dto';
import {
	getContacts,
	createContact,
	updateContact,
	deleteContact,
} from './contacts.controller';

const router = express.Router();

router
	.route('/')
	.get(getContacts)
	.post(validationErrorHandler(createContactDto), createContact);
router
	.route('/:id')
	.put(validationErrorHandler(updateContactDto), updateContact)
	.delete(deleteContact);

export default router;
