import { ReviewModel } from '@/app/schemas/review/review.schema';

export const getReportedReviewsService = async (query: Record<string, any> = {}) => {
  const { page = 1, limit = 10, type } = query;
  const skip = (Number(page) - 1) * Number(limit);

  let targetType = 'Business'; // default to event
  if (type === 'profile') targetType = 'BusinessProfile';
  if (type === 'product') targetType = 'Product';

  // We want reviews where reports array exists and is not empty
  const matchStage: any = {
    targetType,
    'reports.0': { $exists: true }
  };

  const pipeline: any[] = [
    { $match: matchStage },
    { $sort: { createdAt: -1 } }
  ];

  // Count total documents before pagination
  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await ReviewModel.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Add pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: Number(limit) });

  // 1. Lookup Reviewer Info (User + Profile)
  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'reviewerUser'
      }
    },
    {
      $lookup: {
        from: 'profiles',
        localField: 'userId',
        foreignField: 'userId',
        as: 'reviewerProfile'
      }
    }
  );

  // 2. Lookup Target Entity dynamically based on targetType
  if (targetType === 'Business') {
    pipeline.push({
      $lookup: {
        from: 'merchants',
        localField: 'targetId',
        foreignField: '_id',
        as: 'targetEntity'
      }
    });
  } else if (targetType === 'BusinessProfile') {
    pipeline.push({
      $lookup: {
        from: 'businessprofiles',
        localField: 'targetId',
        foreignField: '_id',
        as: 'targetEntity'
      }
    });
  } else if (targetType === 'Product') {
    pipeline.push({
      $lookup: {
        from: 'products',
        localField: 'targetId',
        foreignField: '_id',
        as: 'targetEntity'
      }
    });
  }

  pipeline.push({
    $project: {
      id: '$_id',
      rating: 1,
      text: 1,
      isAnonymous: 1,
      createdAt: 1,
      reports: 1,
      reviewer: {
        firstName: { $arrayElemAt: ['$reviewerUser.firstName', 0] },
        lastName: { $arrayElemAt: ['$reviewerUser.lastName', 0] },
        avatar: { $arrayElemAt: ['$reviewerProfile.profileAvatar', 0] }
      },
      target: {
        // We handle mapping target entity fields in JS or try to do it in aggregation
        // Since Merchants have businessName, BusinessProfiles have firstName/lastName, Products have productName
        name: {
          $cond: {
            if: { $eq: [targetType, 'Business'] },
            then: { $arrayElemAt: ['$targetEntity.businessName', 0] },
            else: {
              $cond: {
                if: { $eq: [targetType, 'Product'] },
                then: { $arrayElemAt: ['$targetEntity.productName', 0] },
                else: { $concat: [{ $arrayElemAt: ['$targetEntity.firstName', 0] }, " ", { $arrayElemAt: ['$targetEntity.lastName', 0] }] }
              }
            }
          }
        },
        image: {
          $cond: {
            if: { $eq: [targetType, 'Business'] },
            then: { $arrayElemAt: ['$targetEntity.coverPhoto', 0] },
            else: {
              $cond: {
                if: { $eq: [targetType, 'Product'] },
                then: { $arrayElemAt: ['$targetEntity.productImage', 0] },
                else: { $arrayElemAt: ['$targetEntity.businessLogo', 0] } // Business profile might not have coverPhoto
              }
            }
          }
        },
        address: {
          $cond: {
            if: { $eq: [targetType, 'Business'] },
            then: { $arrayElemAt: ['$targetEntity.businessAddress', 0] },
            else: null
          }
        },
        description: {
          $cond: {
            if: { $eq: [targetType, 'Product'] },
            then: { $arrayElemAt: ['$targetEntity.description', 0] },
            else: null
          }
        },
        price: {
          $cond: {
            if: { $eq: [targetType, 'Product'] },
            then: { $arrayElemAt: ['$targetEntity.price', 0] },
            else: null
          }
        },
        discount: {
          $cond: {
            if: { $eq: [targetType, 'Product'] },
            then: { $arrayElemAt: ['$targetEntity.discount', 0] },
            else: null
          }
        }
      }
    }
  });

  const result = await ReviewModel.aggregate(pipeline);

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

export const deleteReportedReviewService = async (id: string) => {
  const result = await ReviewModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Review not found');
  }
  return result;
};
