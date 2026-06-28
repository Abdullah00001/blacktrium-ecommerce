import { UserModel } from '@/app/schemas/user/user.schema';
import mongoose from 'mongoose';

export const getAllUsersService = async (query: Record<string, any> = {}) => {
  const { page = 1, limit = 10, search, type } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const matchStage: any = { role: 'user' };

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

  if (type === 'business') {
    pipeline.push({
      $lookup: {
        from: 'businessprofiles',
        localField: '_id',
        foreignField: 'userId',
        as: 'business'
      }
    });
    pipeline.push({ $match: { 'business.0': { $exists: true } } });
  } else if (type === 'merchant') {
    pipeline.push({
      $lookup: {
        from: 'merchants',
        localField: '_id',
        foreignField: 'userId',
        as: 'merchant'
      }
    });
    pipeline.push({ $match: { 'merchant.0': { $exists: true } } });
  }

  // Count total documents before pagination
  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await UserModel.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Add pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: Number(limit) });

  // Lookup profile to get avatar
  pipeline.push({
    $lookup: {
      from: 'profiles',
      localField: '_id',
      foreignField: 'userId',
      as: 'profile'
    }
  });

  pipeline.push({
    $project: {
      id: '$_id',
      firstName: 1,
      lastName: 1,
      email: 1,
      joinDate: '$createdAt',
      status: '$accountStatus',
      avatar: { $arrayElemAt: ['$profile.profileAvatar', 0] }
    }
  });

  const result = await UserModel.aggregate(pipeline);

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

export const getUserDetailsService = async (id: string) => {
  const pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'profiles',
        localField: '_id',
        foreignField: 'userId',
        as: 'profile'
      }
    },
    {
      $project: {
        id: '$_id',
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
        status: '$accountStatus',
        avatar: { $arrayElemAt: ['$profile.profileAvatar', 0] },
      }
    }
  ];

  const result = await UserModel.aggregate(pipeline);
  if (!result || result.length === 0) {
    throw new Error('User not found');
  }

  return result[0];
};

export const updateUserStatusService = async (id: string, status: string) => {
  const result = await UserModel.findByIdAndUpdate(
    id,
    { accountStatus: status },
    { new: true }
  );

  if (!result) {
    throw new Error('User not found');
  }

  return result;
};
