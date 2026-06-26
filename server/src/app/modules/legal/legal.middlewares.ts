import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { LegalModel } from '@/app/schemas/legal/legal.schema';

export const findLegalDocById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid document ID format',
        traceId,
      });
      return;
    }

    const foundLegalDoc = await LegalModel.findById(id);

    if (!foundLegalDoc) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'No legal content document found',
        traceId,
      });
      return;
    }

    req.legalDoc = foundLegalDoc;

    next();
  }
);
