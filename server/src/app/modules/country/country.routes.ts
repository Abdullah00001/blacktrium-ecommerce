import { Router } from 'express';

import {
  getCountriesController,
  updateCountryStatusController,
} from '@/app/modules/country/country.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CountryQuerySchema,
  UpdateCountryStatusSchema,
} from '@/app/modules/country/country.schemas';
import {
  checkAdminAccessToken,
  findUserById,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

router
  .route('/country')
  .get(validateReqQuery(CountryQuerySchema), getCountriesController);

router
  .route('/admin/country/:id/status')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(UpdateCountryStatusSchema),
    updateCountryStatusController
  );

export default router;
