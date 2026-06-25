import { Router } from 'express';

import { validateReqBody } from '@/app/utils/system.utils';
import {
  adminAccessTokenController,
  adminRefreshTokenController,
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
  adminLoginSchema,
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
  checkAdminAccessToken,
  checkAdminRefreshToken,
  checkCurrentPassword,
  checkDuplicateUser,
  checkOtp,
  checkOtpPageToken,
  checkPassword,
  findRecoverUserByEmail,
  findUserByEmail,
  findUserById,
  isAdmin,
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

/**
 * ================================================
 * ---------------- ADMIN AUTH --------------------
 * ================================================
 */

router
  .route('/admin/auth/login')
  .post(
    validateReqBody(adminLoginSchema),
    findUserByEmail,
    isAdmin,
    checkPassword,
    loginController
  );

router
  .route('/admin/auth/check')
  .post(checkAdminAccessToken, isAdmin, adminAccessTokenController);

router
  .route('/admin/auth/refresh')
  .post(checkAdminRefreshToken, isAdmin, adminRefreshTokenController);

router
  .route('/admin/profile/password')
  .post(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(changePasswordSchema),
    checkCurrentPassword,
    changePasswordController
  );

export default router;
