import { Types } from 'mongoose';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { IBusinessProfile } from '@/app/schemas/businessprofile/businessprofile.types';
import {
  TUpdateBusinessProfile,
  TBusinessProfileQuery,
} from '@/app/modules/businessprofile/businessprofile.schemas';

export const getMyBusinessProfileService = async ({
  userId,
}: {
  userId: string;
}): Promise<IBusinessProfile | null> => {
  const profile = await BusinessProfileModel.findOne({
    userId: new Types.ObjectId(userId),
  }).populate('subscriptionId');
  return profile;
};

export const getBusinessProfileByIdService = async ({
  id,
}: {
  id: string;
}): Promise<IBusinessProfile | null> => {
  const profile = await BusinessProfileModel.findById(id).populate('subscriptionId');
  return profile;
};

export const updateBusinessProfileService = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: TUpdateBusinessProfile;
}): Promise<unknown> => {
  const result = await BusinessProfileModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: payload },
    { new: true }
  );
  if (!result) {
    throw new Error('Business Profile not found');
  }
  return result;
};

export const getAllBusinessProfilesService = async ({
  query,
}: {
  query: TBusinessProfileQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10, search, status, businessOwnerType } = query as any;
  const skip = (page - 1) * limit;
  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) {
    filter.status = status;
  }
  if (businessOwnerType) {
    filter.businessOwnerType = businessOwnerType;
  }

  const [data, total] = await Promise.all([
    BusinessProfileModel.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('subscriptionId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    BusinessProfileModel.countDocuments(filter),
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

export const updateBusinessProfileStatusService = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<unknown> => {
  const result = await BusinessProfileModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );
  if (!result) {
    throw new Error('Business Profile not found');
  }
  return result;
};
