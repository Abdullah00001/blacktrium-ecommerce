import { Router } from 'express';

import { validateReqBody } from '@/app/utils/system.utils';
import {
  changePasswordController,
  checkAccessTokenController,
  loginController,
  logoutController,
  recoverFindController,
  recoverResetPasswordController,
  resendOtpController,
  signupController,
  verifyRecoverOtpController,
  verifySignupOtpController,
} from '@/app/modules/auth/auth.controllers';
import {
  changePasswordSchema,
  loginSchema,
  recoverFindSchema,
  recoverResetSchema,
  signupPayloadSchema,
  verifyOtpSchema,
} from '@/app/modules/auth/auth.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  checkCurrentPassword,
  checkDuplicateUser,
  checkOtp,
  checkOtpPageToken,
  checkPassword,
  findRecoverUserByEmail,
  findUserByEmail,
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
    checkAccountStatus,
    validateReqBody(verifyOtpSchema),
    checkOtp,
    verifySignupOtpController
  );

router
  .route('/auth/resend')
  .post(checkOtpPageToken, checkAccountStatus, resendOtpController);

router
  .route('/auth/check')
  .get(checkAccessToken, checkAccountStatus, checkAccessTokenController);

router
  .route('/auth/logout')
  .post(checkAccessToken, checkAccountStatus, logoutController);

router
  .route('/auth/login')
  .post(
    validateReqBody(loginSchema),
    findUserByEmail,
    checkPassword,
    loginController
  );

router
  .route('/profile/password')
  .post(
    checkAccessToken,
    checkAccountStatus,
    validateReqBody(changePasswordSchema),
    checkCurrentPassword,
    changePasswordController
  );

/**
 * =======================================
 * --------- FORGOT PASSWORD -------------
 * =======================================
 */

router
  .route('/auth/recover/find')
  .post(
    validateReqBody(recoverFindSchema),
    findRecoverUserByEmail,
    recoverFindController
  );

router
  .route('/auth/recover/verify')
  .post(
    checkOtpPageToken,
    checkAccountStatus,
    validateReqBody(verifyOtpSchema),
    checkOtp,
    verifyRecoverOtpController
  );

router
  .route('/auth/recover/resend')
  .post(checkOtpPageToken, checkAccountStatus, resendOtpController);

router
  .route('/auth/recover/reset')
  .post(
    checkOtpPageToken,
    checkAccountStatus,
    validateReqBody(recoverResetSchema),
    recoverResetPasswordController
  );
export default router;
