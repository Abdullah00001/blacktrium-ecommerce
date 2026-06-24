import { singleDeleteToS3, singleUploadToS3 } from '@/app/utils/s3.utils';
import {
  extractS3KeyFromUrl,
  formatDeleteResponse,
  formatUploadResponse,
  generateFileInfo,
  normalizeImageUrls,
} from '@/app/utils/system.utils';

export const uploadImageService = async ({
  files,
  imageUrl,
  imageUrls,
}: {
  files: Express.Multer.File[];
  imageUrl?: string;
  imageUrls?: string[];
}): Promise<unknown> => {
  const oldImageUrls = normalizeImageUrls({ imageUrl, imageUrls });

  await Promise.all(
    oldImageUrls.map((url) =>
      singleDeleteToS3({ key: extractS3KeyFromUrl(url) })
    )
  );

  const uploadedImageUrls = await Promise.all(
    files.map((file) =>
      singleUploadToS3(
        generateFileInfo({
          filename: file.filename,
          originalname: file.originalname,
        })
      )
    )
  );

  return formatUploadResponse(uploadedImageUrls);
};

export const deleteImageService = async ({
  imageUrl,
  imageUrls,
}: {
  imageUrl?: string;
  imageUrls?: string[];
}): Promise<unknown> => {
  const deletedImageUrls = normalizeImageUrls({ imageUrl, imageUrls });

  await Promise.all(
    deletedImageUrls.map((url) =>
      singleDeleteToS3({ key: extractS3KeyFromUrl(url) })
    )
  );

  return formatDeleteResponse(deletedImageUrls);
};
