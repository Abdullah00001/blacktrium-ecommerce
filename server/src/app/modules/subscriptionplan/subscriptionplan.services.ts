import { SubscriptionplanModel } from '@/app/schemas/subscriptionplan/subscriptionplan.schema';
import { ISubscriptionplan } from '@/app/schemas/subscriptionplan/subscriptionplan.types';
import {
  TCreateSubscriptionPlan,
  TUpdateSubscriptionPlan,
  TAdminUpdateSubscriptionPlan,
  TSubscriptionPlanQuery,
} from '@/app/modules/subscriptionplan/subscriptionplan.schemas';

export const createSubscriptionPlanService = async ({
  payload,
}: {
  payload: TCreateSubscriptionPlan;
}): Promise<unknown> => {
  const result = await SubscriptionplanModel.create(payload);
  return result;
};

export const getAllSubscriptionPlansService = async ({
  query,
}: {
  query: TSubscriptionPlanQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10, search, status, planTier } = query;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  if (status) {
    filter.status = status;
  }

  if (planTier) {
    filter.planTier = planTier;
  }

  const [data, total] = await Promise.all([
    SubscriptionplanModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ price: 1, createdAt: -1 }),
    SubscriptionplanModel.countDocuments(filter),
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

export const getSubscriptionPlanByIdService = async ({
  id,
}: {
  id: string;
}): Promise<ISubscriptionplan | null> => {
  const plan = await SubscriptionplanModel.findById(id);
  return plan;
};

export const updateSubscriptionPlanService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateSubscriptionPlan | TAdminUpdateSubscriptionPlan;
}): Promise<unknown> => {
  const result = await SubscriptionplanModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  if (!result) {
    throw new Error('Subscription plan not found');
  }
  return result;
};
