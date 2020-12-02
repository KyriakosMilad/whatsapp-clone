import express from 'express';
import { signIn, verifyAuthCode, test } from './users.controller';
import auth from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/signin').post(signIn);
router.route('/test').get(auth, test);
router.route('/authenticate').post(verifyAuthCode);

export default router;
