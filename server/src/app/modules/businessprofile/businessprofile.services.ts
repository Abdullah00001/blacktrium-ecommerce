import { Types } from 'mongoose';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { IBusinessProfile } from '@/app/schemas/businessprofile/businessprofile.types';
import {
  TCreateBusinessProfile,
  TUpdateBusinessProfile,
  TBusinessProfileQuery,
} from '@/app/modules/businessprofile/businessprofile.schemas';


// ========================
// Business Profile Services
// ========================

export const createBusinessProfileService = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: TCreateBusinessProfile;
}): Promise<unknown> => {
  
    const result = await BusinessProfileModel.create({
      ...payload,
      userId: new Types.ObjectId(userId),
    });

    return result;
  
};

export const getMyBusinessProfilesService = async ({
  userId,
}: {
  userId: string;
}): Promise<unknown> => {
  
    const profiles = await BusinessProfileModel.find({
      userId: new Types.ObjectId(userId),
    })
      .populate('categoryId', 'categoryName')
      .populate('subCategoryId', 'subCategoryName')
      .sort({ createdAt: -1 });
    return profiles;
  
};

export const getBusinessProfileByIdService = async ({
  id,
}: {
  id: string;
}): Promise<IBusinessProfile | null> => {
  
    const profile = await BusinessProfileModel.findById(id)
      .populate('categoryId', 'categoryName')
      .populate('subCategoryId', 'subCategoryName');
    return profile;
  
};

export const updateBusinessProfileService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateBusinessProfile;
}): Promise<unknown> => {
  
    const result = await BusinessProfileModel.findByIdAndUpdate(
      id,
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
  
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      categoryId,
      subCategoryId,
      countryId,
      businessOwnerType,
      businessType,
      location,
      isFeatured
    } = query as any;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (search) {
      filter.businessName = { $regex: search, $options: 'i' };
    }

    if (status) {
      filter.status = status;
    }

    if (categoryId) {
      filter.categoryId = new Types.ObjectId(categoryId);
    }

    if (subCategoryId) {
      filter.subCategoryId = new Types.ObjectId(subCategoryId);
    }

    if (countryId) {
      filter.countryId = new Types.ObjectId(countryId);
    }

    if (businessOwnerType) {
      filter.businessOwnerType = businessOwnerType;
    }

    if (businessType) {
      filter.businessType = businessType;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (isFeatured !== undefined) {
      filter.spotlightFeature = isFeatured;
    }

    const [data, total] = await Promise.all([
      BusinessProfileModel.find(filter)
        .populate('categoryId', 'categoryName')
        .populate('subCategoryId', 'subCategoryName')
        .populate('countryId', 'countryName')
        .populate('userId', 'firstName lastName email')
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
