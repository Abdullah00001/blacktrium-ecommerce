import { LegalModel } from '@/app/schemas/legal/legal.schema';
import { TLegalQuery } from '@/app/modules/legal/legal.schemas';
import { ILegal } from '@/app/schemas/legal/legal.types';
import { getRedisClient } from '@/app/configs/redis.config';

export const getLegalContentService = async ({
  query,
}: {
  query: TLegalQuery;
}): Promise<unknown> => {
  try {
    const redisClient = getRedisClient();
    const { targetRole, contentType } = query;
    const result = await LegalModel.findOne({
      targetRole,
      contentType,
    } as Partial<ILegal>);
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateLegalContentService = async ({
  content,
  legalDoc,
}: {
  content: string;
  legalDoc: ILegal;
}): Promise<unknown> => {
  try {
    const redisClient = getRedisClient();
    const result = await LegalModel.findByIdAndUpdate(
      legalDoc._id,
      {
        $set: { content },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
