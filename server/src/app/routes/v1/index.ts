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
];

const v1Routes = Router();

routes.forEach((route) => v1Routes.use(route));

export default v1Routes;
