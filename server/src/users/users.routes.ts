import express from 'express';
import validationErrorHandler from '../middlewares/validationErrorHandler';
import { signIn, verifyAuthCode } from './users.controller';
import signInDto from './signIn.dto';
import authDto from './auth.dto';

const router = express.Router();

router.route('/signin').post(validationErrorHandler(signInDto), signIn);
router.route('/authenticate').post(validationErrorHandler(authDto), verifyAuthCode);

export default router;
