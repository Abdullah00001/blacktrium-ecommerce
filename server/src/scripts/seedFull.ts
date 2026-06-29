import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Models
import { UserModel } from '@/app/schemas/user/user.schema';
import { ProfileModel } from '@/app/schemas/profile/profile.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { SubscriptionplanModel } from '@/app/schemas/subscriptionplan/subscriptionplan.schema';
import { SubscriptionModel } from '@/app/schemas/subscription/subscription.schema';
import { CategoryModel } from '@/app/schemas/category/category.schema';
import { SubcategoryModel } from '@/app/schemas/subcategory/subcategory.schema';
import { ProductCategoryModel } from '@/app/schemas/productcategory/productcategory.schema';
import { ProductModel } from '@/app/schemas/product/product.schema';
import { MerchantModel } from '@/app/schemas/merchant/merchant.schema';
import { OrderModel } from '@/app/schemas/order/order.schema';
import { BusinessModel } from '@/app/schemas/business/business.schema';

const seedFull = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing Environment Variable: MONGODB_URI');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB for Full Seeding');
    
    console.log('Clearing old dev data (safe collections only)...');
    // Note: Not clearing Country or Legal as they might have been seeded separately
    await UserModel.deleteMany({ role: { $in: ['user', 'admin'] as any } });
    await ProfileModel.deleteMany({});
    await BusinessProfileModel.deleteMany({});
    await SubscriptionplanModel.deleteMany({});
    await SubscriptionModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await SubcategoryModel.deleteMany({});
    await ProductCategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    await MerchantModel.deleteMany({});
    await BusinessModel.deleteMany({});
    await OrderModel.deleteMany({});

    const passwordHash = await bcrypt.hash('Password123!', 10);

    // 1. Create Subscription Plans
    console.log('Seeding Subscription Plans...');
    const plans = await SubscriptionplanModel.insertMany([
      {
        revenueCatId: 'rc_free', packageId: 'pkg_free', productId: 'prod_free',
        name: 'Free', description: 'Free Trial', planTier: 'free', price: 0, billingPeriod: 'lifetime',
        features: [{ name: '30 Days', isIncluded: true }]
      },
      {
        revenueCatId: 'rc_starter', packageId: 'pkg_starter', productId: 'prod_starter',
        name: 'Starter', description: 'Essential Features', planTier: 'starter', price: 9.99, billingPeriod: 'monthly',
        features: [
          { name: 'Business Profile', isIncluded: true },
          { name: 'Analytics', isIncluded: false }
        ]
      }
    ]);

    // 2. Create Categories & Product Categories
    console.log('Seeding Categories...');
    const category = await CategoryModel.create({ categoryName: 'Clothing', categoryImage: 'https://example.com/cat.jpg', status: true });
    const subCategory = await SubcategoryModel.create({ categoryId: category._id, subCategoryName: 'Men', status: true });
    const productCategory = await ProductCategoryModel.create({ categoryName: 'Shirts', status: true });

    // 3. Create Users
    console.log('Seeding Users (Admin, Consumers & Merchants)...');
    
    // Admin 1
    const adminUser = await UserModel.create({
      firstName: 'Admin', lastName: 'User', email: 'kefom76841@fishnone.com', password: passwordHash,
      isVerified: true, isLegalTermsAccepted: true, role: 'admin' as any
    });
    await ProfileModel.create({ userId: adminUser._id, country: 'US' });
    
    // Consumer 1
    const user1 = await UserModel.create({
      firstName: 'John', lastName: 'Doe', email: 'user1@example.com', password: passwordHash,
      isVerified: true, isLegalTermsAccepted: true, role: 'user' as any
    });
    await ProfileModel.create({ userId: user1._id, country: 'US' });

    // Merchant 1
    const merchantUser1 = await UserModel.create({
      firstName: 'Sarah', lastName: 'Store', email: 'merchant@example.com', password: passwordHash,
      isVerified: true, isLegalTermsAccepted: true, role: 'user' as any
    });
    await ProfileModel.create({ userId: merchantUser1._id, country: 'US' });

    // 4. Create Business Profile & Merchant setup for Merchant 1
    console.log('Seeding Business Profiles & Subscriptions...');
    const businessProfile = await BusinessProfileModel.create({
      userId: merchantUser1._id,
      firstName: 'Sarah',
      lastName: 'Store',
      email: 'merchant@example.com',
      brandName: "Sarah's Boutique",
      businessType: 'Physical',
      status: 'active'
    });

    await MerchantModel.create({
      userId: merchantUser1._id,
      businessProfileId: businessProfile._id,
      shopName: "Sarah's Boutique",
      aboutShop: "High quality fashion.",
      termsAndCondition: "No refunds.",
      shopType: 'Fashion',
      location: 'New York, USA',
      phone: '+14155552671',
      isFeatured: true
    } as any);

    console.log('Seeding Businesses...');
    await BusinessModel.create({
      businessProfileId: businessProfile._id,
      businessName: 'Elite Dining Co.',
      businessType: 'Restaurant',
      categoryId: category._id,
      subCategoryId: subCategory._id,
      location: 'Los Angeles, CA',
      websiteLink: 'https://elitedining.com',
      thumbnailImage: 'https://example.com/elite-dining.jpg',
      businessDescription: 'Premium dining experience',
      spotlightFeature: true,
      rating: 4.8,
      reviewsCount: 150,
      status: 'active'
    });

    // Active Subscription for Merchant
    await SubscriptionModel.create({
      userId: merchantUser1._id,
      revenueCatId: plans[1].revenueCatId,
      packageId: plans[1].packageId,
      productId: plans[1].productId,
      planTier: plans[1].planTier,
      platform: 'stripe',
      maxBusinessAllowed: 1,
      isTrial: false,
      status: 'active',
      purchasedAt: new Date(),
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    });

    // 5. Create Products
    console.log('Seeding Products...');
    const product = await ProductModel.create({
      merchantId: merchantUser1._id,
      categoryId: productCategory._id,
      name: 'Vintage Denim Jacket',
      description: 'A classic denim jacket.',
      price: 120,
      location: 'New York',
      shippingCost: 10,
      stockQuantity: 50,
      colors: ['Blue'],
      sizes: ['M', 'L'],
      materials: ['Denim'],
      images: ['https://example.com/jacket.jpg'],
      status: 'active'
    });

    // 6. Create Fake Order (GMV generation)
    console.log('Seeding Orders...');
    await OrderModel.create({
      orderId: 'ORD-MOCK-001',
      buyerId: user1._id,
      merchantId: merchantUser1._id,
      paymentInfo: {
        method: 'stripe',
        status: 'paid',
        subtotal: 120,
        shippingFee: 0,
        total: 120,
      },
      items: [{
        productId: product._id,
        quantity: 1,
        price: 120,
        color: 'Blue',
        size: 'M'
      }],
      customerInfo: {
        name: 'John Doe',
        address: '123 Fake St, New York, USA',
        phone: '+14155552671',
      },
      status: 'delivered'
    });

    console.log('\n--------------------------------------------');
    console.log('✓ Seeding complete! Logins:');
    console.log('Admin: kefom76841@fishnone.com / Password123!');
    console.log('User: user1@example.com / Password123!');
    console.log('Merchant: merchant@example.com / Password123!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error during full seeding:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedFull();
