import { ContactModel } from '@/app/schemas/contact/contact.schema';
import { IContact } from '@/app/schemas/contact/contact.types';

export const createContactService = async (payload: Partial<IContact>) => {
  const result = await ContactModel.create(payload);
  return result;
};

export const getAllContactsService = async (query: Record<string, any> = {}) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (status) {
    filter.status = status;
  }

  const result = await ContactModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('userId', 'email name');

  const total = await ContactModel.countDocuments(filter);

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

export const updateContactStatusService = async (
  id: string,
  payload: { status: string }
) => {
  const result = await ContactModel.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true, runValidators: true }
  );
  if (!result) {
    throw new Error('Contact message not found');
  }
  return result;
};
