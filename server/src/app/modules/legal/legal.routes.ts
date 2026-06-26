import { Router } from 'express';
import {
  getLegalContentController,
  updateLegalContentController,
} from '@/app/modules/legal/legal.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  LegalContentSchema,
  LegalQuerySchema,
} from '@/app/modules/legal/legal.schemas';
import {
  checkAdminAccessToken,
  findUserById,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import { findLegalDocById } from '@/app/modules/legal/legal.middlewares';

const router = Router();

router
  .route('/legal')
  .get(validateReqQuery(LegalQuerySchema), getLegalContentController);

router
  .route('/admin/legal/:id')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    findLegalDocById,
    validateReqBody(LegalContentSchema),
    updateLegalContentController
  );

export default router;
