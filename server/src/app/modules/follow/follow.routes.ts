import { Router } from 'express';
import {
  toggleFollowController,
  checkFollowStatusController,
} from '@/app/modules/follow/follow.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import { ToggleFollowSchema } from '@/app/modules/follow/follow.schemas';
import {
  checkAccessToken,
    checkAccountStatus,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// Toggle Follow/Unfollow
router
  .route('/follow/toggle')
  .post(
    checkAccessToken,
    checkAccountStatus,
    validateReqBody(ToggleFollowSchema),
    toggleFollowController
  );

// Check if currently following
router
  .route('/follow/status')
  .get(
    checkAccessToken,
    checkAccountStatus,
    checkFollowStatusController
  );

export const FollowRoutes = router;
