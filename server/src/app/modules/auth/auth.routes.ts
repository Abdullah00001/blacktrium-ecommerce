import { Router } from 'express';

import { signupController } from '@/app/modules/auth/auth.controllers';

const router = Router();

router.route('/auth/signup').post(signupController);

export default router;
