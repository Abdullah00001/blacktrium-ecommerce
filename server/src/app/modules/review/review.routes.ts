import { Router } from 'express';
import {
  createReviewController,
  getReviewsByTargetIdController,
  replyToReviewController,
  reportReviewController,
} from '@/app/modules/review/review.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateReviewSchema,
  ReplyReviewSchema,
  ReviewQuerySchema,
  ReportReviewSchema,
} from '@/app/modules/review/review.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// ========================
// Review Routes
// ========================

// POST create review (Authenticated User)
router
  .route('/review')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqBody(CreateReviewSchema),
    createReviewController
  );

// GET reviews by target ID (Public or any User)
router
  .route('/review/target/:targetId')
  .get(
    validateReqQuery(ReviewQuerySchema),
    getReviewsByTargetIdController
  );

// POST reply to a review (Authenticated Business Owner)
router
  .route('/review/:id/reply')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqBody(ReplyReviewSchema),
    replyToReviewController
  );

// POST report a review
router
  .route('/review/:id/report')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqBody(ReportReviewSchema),
    reportReviewController
  );

export default router;
