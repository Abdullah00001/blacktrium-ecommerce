import { Types } from 'mongoose';
import { BusinessModel } from '@/app/schemas/business/business.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { IBusiness } from '@/app/schemas/business/business.types';
import {
  TCreateBusiness,
  TUpdateBusiness,
  TBusinessQuery,
} from '@/app/modules/business/business.schemas';

export const createBusinessService = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: TCreateBusiness;
}): Promise<unknown> => {
  const profile = await BusinessProfileModel.findOne({ userId: new Types.ObjectId(userId) }).populate('subscriptionId');
  if (!profile) {
    throw new Error('Business Profile not found');
  }

  // Check subscription logic here
  // If no subscription or inactive, the business starts as inactive
  const isActive = profile.status === 'active';

  const result = await BusinessModel.create({
    ...payload,
    businessProfileId: profile._id,
    status: isActive ? 'active' : 'inactive',
  });

  return result;
};

export const getMyBusinessesService = async ({
  userId,
}: {
  userId: string;
}): Promise<unknown> => {
  const profile = await BusinessProfileModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) return [];

  const businesses = await BusinessModel.find({
    businessProfileId: profile._id,
  })
    .populate('categoryId', 'categoryName')
    .populate('subCategoryId', 'subCategoryName')
    .sort({ createdAt: -1 });
  return businesses;
};

export const getBusinessByIdService = async ({
  id,
}: {
  id: string;
}): Promise<IBusiness | null> => {
  const business = await BusinessModel.findById(id)
    .populate('categoryId', 'categoryName')
    .populate('subCategoryId', 'subCategoryName');
  return business;
};

export const updateBusinessService = async ({
  id,
  userId,
  payload,
}: {
  id: string;
  userId: string;
  payload: TUpdateBusiness;
}): Promise<unknown> => {
  const profile = await BusinessProfileModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) throw new Error('Business Profile not found');

  const business = await BusinessModel.findOne({ _id: new Types.ObjectId(id), businessProfileId: profile._id });
  if (!business) throw new Error('Business not found or not owned by you');

  const result = await BusinessModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true }
  );
  return result;
};

export const getAllBusinessesService = async ({
  query,
}: {
  query: TBusinessQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10, search, status, categoryId, subCategoryId, countryId, businessType, location, isFeatured } = query as any;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (search) filter.businessName = { $regex: search, $options: 'i' };
  if (status) filter.status = status;
  if (categoryId) filter.categoryId = new Types.ObjectId(categoryId);
  if (subCategoryId) filter.subCategoryId = new Types.ObjectId(subCategoryId);
  if (countryId) filter.countryId = new Types.ObjectId(countryId);
  if (businessType) filter.businessType = businessType;
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (isFeatured !== undefined) filter.spotlightFeature = isFeatured;

  const [data, total] = await Promise.all([
    BusinessModel.find(filter)
      .populate('categoryId', 'categoryName')
      .populate('subCategoryId', 'subCategoryName')
      .populate('countryId', 'countryName')
      .populate('businessProfileId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    BusinessModel.countDocuments(filter),
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

export const updateBusinessStatusService = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<unknown> => {
  const result = await BusinessModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );
  if (!result) throw new Error('Business not found');
  return result;
};
