import { getTraceId } from '@/app/configs/requestContext.configs';
import { asyncHandler } from '@/app/utils/system.utils';
import { Request, Response } from 'express';
import { TImageSchemaPayload } from '@/app/modules/image/image.schemas';
import {
  uploadImageService,
  deleteImageService,
} from '@/app/modules/image/image.services';

export const uploadImageController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { imageUrl, imageUrls } = req.body as TImageSchemaPayload;
    const files = (req.files as Express.Multer.File[]) || [];
    const data = await uploadImageService({ files, imageUrl, imageUrls });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Image upload successful',
      data,
      traceId,
    });
    return;
  }
);

export const deleteImageController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { imageUrl, imageUrls } = req.body as TImageSchemaPayload;
    const data = await deleteImageService({ imageUrl, imageUrls });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Image delete successful',
      data,
      traceId,
    });
    return;
  }
);
