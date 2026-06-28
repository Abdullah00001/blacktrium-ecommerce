import { Router } from 'express';

import AuthRoutes from '@/app/modules/auth/auth.routes';
import ProfileRoutes from '@/app/modules/profile/profile.routes';
import ImageRoutes from '@/app/modules/image/image.routes';
import LegalRoutes from '@/app/modules/legal/legal.routes';
import CountryRoutes from '@/app/modules/country/country.routes';
import CategoryRoutes from '@/app/modules/category/category.routes';
import ProductCategoryRoutes from '@/app/modules/productcategory/productcategory.routes';
import SubscriptionRoutes from '@/app/modules/subscription/subscription.routes';
import BusinessProfileRoutes from '@/app/modules/businessprofile/businessprofile.routes';
import BusinessRoutes from '@/app/modules/business/business.routes';
import SubscriptionPlanRoutes from '@/app/modules/subscriptionplan/subscriptionplan.routes';
import MerchantRoutes from '@/app/modules/merchant/merchant.routes';
import ProductRoutes from '@/app/modules/product/product.routes';
import WalletRoutes from '@/app/modules/wallet/wallet.routes';
import TransactionRoutes from '@/app/modules/transaction/transaction.routes';
import OrderRoutes from '@/app/modules/order/order.routes';
import ReviewRoutes from '@/app/modules/review/review.routes';
import FavoriteRoutes from '@/app/modules/favorite/favorite.routes';
import { FollowRoutes } from '@/app/modules/follow/follow.routes';
import { CartRoutes } from '@/app/modules/cart/cart.routes';
import ContactRoutes from '@/app/modules/contact/contact.routes';
import DashboardRoutes from '@/app/modules/dashboard/dashboard.routes';
import UserRoutes from '@/app/modules/user/user.routes';
import SubscriberRoutes from '@/app/modules/subscriber/subscriber.routes';
import ComplainRoutes from '@/app/modules/complain/complain.routes';
import EarningRoutes from '@/app/modules/earning/earning.routes';
import NotificationRoutes from '@/app/modules/notification/notification.routes';

const routes: Router[] = [
  AuthRoutes,
  ProfileRoutes,
  ImageRoutes,
  LegalRoutes,
  CountryRoutes,
  CategoryRoutes,
  ProductCategoryRoutes,
  SubscriptionRoutes,
  BusinessProfileRoutes,
  BusinessRoutes,
  SubscriptionPlanRoutes,
  MerchantRoutes,
  ProductRoutes,
  WalletRoutes,
  TransactionRoutes,
  OrderRoutes,
  ReviewRoutes,
  FavoriteRoutes,
  FollowRoutes,
  CartRoutes,
  ContactRoutes,
  DashboardRoutes,
  UserRoutes,
  SubscriberRoutes,
  ComplainRoutes,
  EarningRoutes,
  NotificationRoutes,
];

const v1Routes = Router();

routes.forEach((route) => v1Routes.use(route));

export default v1Routes;
