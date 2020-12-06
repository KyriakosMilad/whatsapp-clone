import express from 'express';
import {
	getContacts,
	createContact,
	updateContact,
	deleteContact,
} from './contacts.controller';

const router = express.Router();

router.route('/').get(getContacts).post(createContact);
router.route('/:id').put(updateContact).delete(deleteContact);

export default router;
