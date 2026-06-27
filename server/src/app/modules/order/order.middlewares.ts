import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { OrderModel } from '@/app/schemas/order/order.schema';

export const checkOrderExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid order ID format',
      });
      return;
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'Order not found',
      });
      return;
    }

    (req as any).order = order;

    next();
  } catch (error) {
    next(error);
  }
};
