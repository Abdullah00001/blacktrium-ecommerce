/* eslint-disable no-useless-catch */
import { LegalModel } from '@/app/schemas/legal/legal.schema';
import { TLegalQuery } from '@/app/modules/legal/legal.schemas';
import { ILegal } from '@/app/schemas/legal/legal.types';

export const getLegalContentService = async ({
  query,
}: {
  query: TLegalQuery;
}): Promise<unknown> => {
  try {
  
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
