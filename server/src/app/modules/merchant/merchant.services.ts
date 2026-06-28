import { Types } from 'mongoose';
import { MerchantModel } from '@/app/schemas/merchant/merchant.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { OrderModel } from '@/app/schemas/order/order.schema';
import { IMerchant } from '@/app/schemas/merchant/merchant.types';
import {
  TCreateMerchant,
  TUpdateMerchant,
  TMerchantQuery,
} from '@/app/modules/merchant/merchant.schemas';

// ========================
// Merchant Services
// ========================

export const createMerchantService = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: TCreateMerchant;
}): Promise<unknown> => {
  const profile = await BusinessProfileModel.findOne({ userId: new Types.ObjectId(userId) }).populate('subscriptionId');
  if (!profile) throw new Error('Business Profile not found');

  const planTier = profile.subscriptionId ? (profile.subscriptionId as any).planTier : 'starter';
  if (planTier.toLowerCase() !== 'pro') {
    throw new Error('To create a Merchant Profile and start selling your products, you need to subscribe to the Pro plan. Please upgrade your account to Pro to continue.');
  }

  const existingShop = await MerchantModel.findOne({ businessProfileId: profile._id });
  if (existingShop) throw new Error('A merchant shop already exists for this business profile');

  const result = await MerchantModel.create({
    ...payload,
    userId: new Types.ObjectId(userId),
    businessProfileId: profile._id,
  });

  return result;
};

export const getMyMerchantService = async ({
  userId,
}: {
  userId: string;
}): Promise<unknown> => {
  const profile = await BusinessProfileModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) return null;

  const shop = await MerchantModel.findOne({
    businessProfileId: profile._id,
  }).sort({ createdAt: -1 });
  
  return shop;
};

export const getMerchantByIdService = async ({
  id,
}: {
  id: string;
}): Promise<IMerchant | null> => {
  const shop = await MerchantModel.findById(id);
  return shop;
};

export const updateMerchantService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateMerchant;
}): Promise<unknown> => {
  const result = await MerchantModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true }
  );
  if (!result) {
    throw new Error('Merchant shop not found');
  }
  return result;
};

export const getAllMerchantsService = async ({
  query,
}: {
  query: TMerchantQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10, search, status } = query;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (search) {
    filter.shopName = { $regex: search, $options: 'i' };
  }

  if (status) {
    filter.status = status;
  }

  const [data, total] = await Promise.all([
    MerchantModel.find(filter)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    MerchantModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      totalPages,
      links: {
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        firstPage: 1,
        lastPage: totalPages || 1,
      },
    },
  };
};

export const updateMerchantStatusService = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<unknown> => {
  const result = await MerchantModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );
  if (!result) {
    throw new Error('Merchant shop not found');
  }
  return result;
};

export const getMerchantAnalyticsService = async ({
  userId,
}: {
  userId: string;
}) => {
  const profile = await BusinessProfileModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) throw new Error('Business Profile not found');

  const merchant = await MerchantModel.findOne({ businessProfileId: profile._id });
  if (!merchant) throw new Error('Merchant shop not found');

  // Total and Monthly Earnings via aggregation
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

  const earningsAggregation = await OrderModel.aggregate([
    {
      $match: {
        merchantId: merchant._id,
        status: { $ne: 'cancelled' },
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        monthlyTotal: { $sum: "$paymentInfo.total" }
      }
    }
  ]);

  const monthlyEarning = new Array(12).fill(0);
  let totalEarning = 0;

  earningsAggregation.forEach(item => {
    // MongoDB month is 1-indexed (1=Jan, 12=Dec)
    monthlyEarning[item._id - 1] = item.monthlyTotal;
  });

  const totalEarningAgg = await OrderModel.aggregate([
    {
      $match: {
        merchantId: merchant._id,
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$paymentInfo.total" }
      }
    }
  ]);
  
  if (totalEarningAgg.length > 0) {
    totalEarning = totalEarningAgg[0].total;
  }

  // Recent Transactions
  const recentTransactions = await OrderModel.find({ merchantId: merchant._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('orderId paymentInfo status createdAt');

  return {
    totalEarning,
    totalView: merchant.totalViews || 0,
    monthlyEarning,
    monthlyView: merchant.monthlyViews || new Array(12).fill(0),
    recentTransactions,
  };
};
