import { SubscriberModel } from '@/app/schemas/subscriber/subscriber.schema';
import { SubscribeStatus } from '@/app/schemas/subscriber/subscriber.types';

export const getAllSubscribersService = async (query: Record<string, any> = {}) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const matchStage: any = { subscribeStatus: SubscribeStatus.SUBSCRIBED };

  if (search) {
    matchStage.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pipeline: any[] = [
    { $match: matchStage },
    { $sort: { createdAt: -1 } }
  ];

  // Count total documents before pagination
  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await SubscriberModel.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Add pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: Number(limit) });

  // Lookup profile to get avatar, if userId exists
  pipeline.push({
    $lookup: {
      from: 'profiles',
      localField: 'userId',
      foreignField: 'userId',
      as: 'profile'
    }
  });

  // Lookup user to get account status, if userId exists
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  });

  pipeline.push({
    $project: {
      id: '$_id',
      firstName: 1,
      lastName: 1,
      email: 1,
      subscribedAt: '$createdAt',
      status: { $ifNull: [{ $arrayElemAt: ['$user.accountStatus', 0] }, 'Active'] },
      avatar: { $arrayElemAt: ['$profile.profileAvatar', 0] }
    }
  });

  const result = await SubscriberModel.aggregate(pipeline);

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
