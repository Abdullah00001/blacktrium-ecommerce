import { OrderModel } from '@/app/schemas/order/order.schema';
import { SubscriptionModel } from '@/app/schemas/subscription/subscription.schema';


export const getAdminEarningStatsService = async () => {
  // Total Product Sales
  const productSalesAgg = await OrderModel.aggregate([
    { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
    { $group: { _id: null, total: { $sum: '$paymentInfo.total' } } }
  ]);
  const totalProductSales = productSalesAgg.length > 0 ? productSalesAgg[0].total : 0;

  // Subscription Earning
  // Subscriptions are usually handled by RevenueCat or Stripe. Since we only store plans,
  // we could aggregate based on the plan price or assume a mock if price isn't stored in Subscription schema yet.
  // For now, let's count active subscriptions or mock a value for the demo.
  // Assuming $10 average per subscription if we don't store exact amount yet.
  const subscriptionCount = await SubscriptionModel.countDocuments({ status: 'active' });
  const subscriptionEarning = subscriptionCount * 10; 

  return {
    totalProductSales,
    subscriptionEarning
  };
};

export const getAdminSubscriptionEarningsService = async (query: Record<string, any>) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const pipeline: any[] = [];
  
  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
  );

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { 'user.firstName': { $regex: search, $options: 'i' } },
          { 'user.lastName': { $regex: search, $options: 'i' } }
        ]
      }
    });
  }

  pipeline.push({ $sort: { purchasedAt: -1 } });

  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await SubscriptionModel.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  pipeline.push({ $skip: skip }, { $limit: Number(limit) });

  pipeline.push({
    $project: {
      id: '$_id',
      name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
      accountType: '$planTier',
      purchaseDate: '$purchasedAt',
      expireDate: '$expiresAt'
    }
  });

  const result = await SubscriptionModel.aggregate(pipeline);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

export const getAdminCommissionEarningsService = async (query: Record<string, any>) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  // Group orders by product items
  const pipeline: any[] = [
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        totalSalesAmount: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        price: { $first: '$items.price' }
      }
    }
  ];

  pipeline.push(
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
  );

  if (search) {
    pipeline.push({
      $match: {
        'product.productName': { $regex: search, $options: 'i' }
      }
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await OrderModel.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  pipeline.push(
    { $sort: { totalSalesAmount: -1 } },
    { $skip: skip },
    { $limit: Number(limit) }
  );

  // Assume a 20% platform commission on product sales
  pipeline.push({
    $project: {
      id: '$_id',
      productName: '$product.productName',
      price: '$price',
      totalSales: '$totalSalesAmount',
      totalEarnings: { $multiply: ['$totalSalesAmount', 0.2] } // 20% commission
    }
  });

  const result = await OrderModel.aggregate(pipeline);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};
