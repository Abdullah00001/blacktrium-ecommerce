import { Request, Response } from 'express';

import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { TLegalContent, TLegalQuery } from '@/app/modules/legal/legal.schemas';
import {
  getLegalContentService,
  updateLegalContentService,
} from '@/app/modules/legal/legal.services';

export const getLegalContentController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as TLegalQuery;
    const traceId = getTraceId();
    const data = await getLegalContentService({ query });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Retrieve legal information successful',
      data,
      traceId,
    });
    return;
  }
);

export const updateLegalContentController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const legalDoc = req.legalDoc;
    const { content } = req.body as TLegalContent;
    const data = await updateLegalContentService({ content, legalDoc });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Retrieve legal information successful',
      data,
      traceId,
    });
    return;
  }
);
