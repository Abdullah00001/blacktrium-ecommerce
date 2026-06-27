import { Router } from 'express';
import {
  createOrderController,
  getMyOrdersController,
  getMerchantOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
} from '@/app/modules/order/order.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  OrderQuerySchema,
} from '@/app/modules/order/order.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
} from '@/app/modules/auth/auth.middlewares';
import { requireMerchantShop } from '@/app/modules/wallet/wallet.middlewares';
import { checkOrderExists } from '@/app/modules/order/order.middlewares';

const router = Router();

// ========================
// Order Routes
// ========================

// POST create order (Authenticated User)
router
  .route('/order')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqBody(CreateOrderSchema),
    createOrderController
  );

// GET my orders (Authenticated User)
router
  .route('/order/my-orders')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqQuery(OrderQuerySchema),
    getMyOrdersController
  );

// GET merchant orders (Authenticated Merchant)
router
  .route('/order/merchant')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    requireMerchantShop,
    validateReqQuery(OrderQuerySchema),
    getMerchantOrdersController
  );

// GET single order details (Authenticated User or Merchant)
router
  .route('/order/:id')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    checkOrderExists,
    getOrderByIdController
  );

// PATCH update order status (Authenticated Merchant)
router
  .route('/order/:id/status')
  .patch(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    requireMerchantShop,
    checkOrderExists,
    validateReqBody(UpdateOrderStatusSchema),
    updateOrderStatusController
  );

export default router;
