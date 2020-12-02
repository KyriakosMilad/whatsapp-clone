import express from 'express';
import { signIn, verifyAuthCode } from './users.controller';

const router = express.Router();

router.route('/signin').post(signIn);
router.route('/authenticate').post(verifyAuthCode);

export default router;
