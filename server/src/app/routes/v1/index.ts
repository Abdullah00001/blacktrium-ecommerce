import { Router } from 'express';

import AuthRoutes from '@/app/modules/auth/auth.routes';
import ProfileRoutes from '@/app/modules/profile/profile.routes';
import ImageRoutes from '@/app/modules/image/image.routes';
import LegalRoutes from '@/app/modules/legal/legal.routes';
import CountryRoutes from '@/app/modules/country/country.routes';
import CategoryRoutes from '@/app/modules/category/category.routes';

const routes: Router[] = [
  AuthRoutes,
  ProfileRoutes,
  ImageRoutes,
  LegalRoutes,
  CountryRoutes,
  CategoryRoutes,
];

const v1Routes = Router();

routes.forEach((route) => v1Routes.use(route));

export default v1Routes;
