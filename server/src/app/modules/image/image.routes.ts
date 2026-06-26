import { Router } from 'express';

import {
  checkAccessToken,
  checkAccountStatus,
  checkAdminAccessToken,
  findUserById,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import {
  deleteImageController,
  uploadImageController,
} from '@/app/modules/image/image.controllers';
import {
  handleMulterError,
  uploadArray,
} from '@/app/middlewares/multer.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  deleteImageSchema,
  imageSchema,
} from '@/app/modules/image/image.schemas';

const router = Router();

router
  .route('/image')
  .post(
    checkAccessToken,
    checkAccountStatus,
    uploadArray('image', 10, true),
    handleMulterError,
    validateReqBody(imageSchema),
    uploadImageController
  )
  .delete(
    checkAccessToken,
    checkAccountStatus,
    validateReqBody(deleteImageSchema),
    deleteImageController
  );

router
  .route('/admin/image')
  .post(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    uploadArray('image', 10, true),
    handleMulterError,
    validateReqBody(imageSchema),
    uploadImageController
  )
  .delete(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(deleteImageSchema),
    deleteImageController
  );

export default router;
