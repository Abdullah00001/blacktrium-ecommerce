import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  createContactService,
  getAllContactsService,
  updateContactStatusService,
} from '@/app/modules/contact/contact.services';

export const createContactController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    // Attach userId if user is authenticated (handled optionally in routes/middlewares)
    const userId = req.user ? (req.user as any)._id : undefined;

    const payload = { ...req.body };
    if (userId) {
      payload.userId = userId;
    }

    const data = await createContactService(payload);

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Contact message submitted successfully',
      data,
      traceId,
    });
  }
);

export const getAllContactsController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const data = await getAllContactsService(req.query);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Contact messages retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateContactStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const data = await updateContactStatusService(id, req.body);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Contact status updated successfully',
      data,
      traceId,
    });
  }
);
