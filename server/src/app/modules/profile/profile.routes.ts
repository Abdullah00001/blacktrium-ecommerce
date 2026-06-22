import { Router } from 'express';

import {
  checkAccessToken,
  checkAccountStatus,
} from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import { profileSchema } from '@/app/modules/profile/profile.schemas';
import { updateProfileController } from '@/app/modules/profile/profile.controllers';

const router = Router();

router
  .route('/profile')
  .patch(checkAccessToken, checkAccountStatus, validateReqBody(profileSchema),updateProfileController);

export default router;
