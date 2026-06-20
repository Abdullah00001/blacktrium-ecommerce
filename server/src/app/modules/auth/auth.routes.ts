import { Router } from 'express';

import { validateReqBody } from '@/app/utils/system.utils';
import { signupController, verifySignupOtpController } from '@/app/modules/auth/auth.controllers';
import {
  signupPayloadSchema,
  verifyOtpSchema,
} from '@/app/modules/auth/auth.schemas';
import {
  checkDuplicateUser,
  checkOtp,
  checkOtpPageToken,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

router
  .route('/auth/signup')
  .post(
    validateReqBody(signupPayloadSchema),
    checkDuplicateUser,
    signupController
  );

router
  .route('/auth/verify')
  .post(
    checkOtpPageToken,
    validateReqBody(verifyOtpSchema),
    checkOtp,
    verifySignupOtpController);

export default router;
