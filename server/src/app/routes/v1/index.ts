import { Router } from 'express';

import AuthRoutes from '@/app/modules/auth/auth.routes';
import ProfileRoutes from '@/app/modules/profile/profile.routes';
import ImageRoutes from "@/app/modules/image/image.routes"
 
const routes: Router[] = [AuthRoutes, ProfileRoutes,ImageRoutes];

const v1Routes = Router();

routes.forEach((route) => v1Routes.use(route));

export default v1Routes;
