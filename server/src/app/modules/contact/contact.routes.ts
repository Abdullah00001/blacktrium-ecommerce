import { Router } from 'express';
import {
  createContactController,
  getAllContactsController,
  updateContactStatusController,
} from '@/app/modules/contact/contact.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  CreateContactSchema,
  AdminUpdateContactStatusSchema,
} from '@/app/modules/contact/contact.schemas';
import {
  checkAdminAccessToken,
  findUserById,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
// Note: POST /contact is public, but we might have an optional auth middleware if we want to attach userId automatically. 
// For simplicity, we just use the public route.

const router = Router();

// ========================
// Public / User Routes
// ========================

// POST create contact message
router
  .route('/contact')
  .post(
    validateReqBody(CreateContactSchema),
    createContactController
  );

// ========================
// Admin Contact Routes
// ========================

// GET all contact messages (Admin)
router
  .route('/admin/contact')
  .get(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    getAllContactsController
  );

// PATCH update contact status (Admin)
router
  .route('/admin/contact/:id/status')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(AdminUpdateContactStatusSchema),
    updateContactStatusController
  );

export default router;
