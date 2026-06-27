import { Types } from 'mongoose';
import { OrderModel } from '@/app/schemas/order/order.schema';
import { ProductModel } from '@/app/schemas/product/product.schema';
import { WalletModel } from '@/app/schemas/wallet/wallet.schema';
import { TransactionModel } from '@/app/schemas/transaction/transaction.schema';
import { IOrder } from '@/app/schemas/order/order.types';
import {
  TCreateOrder,
  TOrderQuery,
  TUpdateOrderStatus,
} from '@/app/modules/order/order.schemas';

// Helper to generate a random order ID like #83473
const generateOrderId = (): string => {
  return '#' + Math.floor(10000 + Math.random() * 90000).toString();
};

export const createOrderService = async ({
  buyerId,
  payload,
}: {
  buyerId: string;
  payload: TCreateOrder;
}): Promise<IOrder> => {
  const merchantObjectId = new Types.ObjectId(payload.merchantId);
  
  // 1. Validate and Deduct Stock for all items
  for (const item of payload.items) {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }
    if (product.stockQuantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
    
    // Deduct stock
    product.stockQuantity -= item.quantity;
    await product.save();
  }

  // 2. Create Order
  let orderIdStr = generateOrderId();
  
  // Basic collision check (in a real system, you'd retry in a loop if it exists)
  const existing = await OrderModel.findOne({ orderId: orderIdStr });
  if (existing) orderIdStr = generateOrderId();

  const order = await OrderModel.create({
    ...payload,
    orderId: orderIdStr,
    buyerId: new Types.ObjectId(buyerId),
    merchantId: merchantObjectId,
    status: 'pending',
  });

  // 3. Handle Payment (If Paid, trigger earnings)
  if (payload.paymentInfo.status === 'paid') {
    const earningAmount = payload.paymentInfo.total; // You could deduct platform fees here later

    // Ensure wallet exists
    let wallet = await WalletModel.findOne({ merchantId: merchantObjectId });
    if (!wallet) {
      wallet = await WalletModel.create({
        merchantId: merchantObjectId,
        balance: 0,
      });
    }

    // Add earning transaction
    await TransactionModel.create({
      merchantId: merchantObjectId,
      type: 'earning',
      amount: earningAmount,
      status: 'approved',
      referenceId: orderIdStr,
    });

    // Update wallet balance
    wallet.balance += earningAmount;
    await wallet.save();
  }

  return order;
};

export const getMyOrdersService = async ({
  buyerId,
  query,
}: {
  buyerId: string;
  query: TOrderQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10, status, orderId } = query;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {
    buyerId: new Types.ObjectId(buyerId),
  };

  if (status) filter.status = status;
  if (orderId) filter.orderId = { $regex: orderId, $options: 'i' };

  const [data, total] = await Promise.all([
    OrderModel.find(filter)
      .populate('merchantId', 'shopName profileImage')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    OrderModel.countDocuments(filter),
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
      },
    },
  };
};

export const getMerchantOrdersService = async ({
  merchantId,
  query,
}: {
  merchantId: string;
  query: TOrderQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10, status, orderId } = query;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {
    merchantId: new Types.ObjectId(merchantId),
  };

  if (status) filter.status = status;
  if (orderId) filter.orderId = { $regex: orderId, $options: 'i' };

  const [data, total] = await Promise.all([
    OrderModel.find(filter)
      .populate('items.productId', 'name images')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    OrderModel.countDocuments(filter),
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
      },
    },
  };
};

export const getOrderByIdService = async ({
  id,
}: {
  id: string;
}): Promise<IOrder | null> => {
  const order = await OrderModel.findById(id)
    .populate('merchantId', 'shopName phone')
    .populate('items.productId', 'name images');
  return order;
};

export const updateOrderStatusService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateOrderStatus;
}): Promise<IOrder> => {
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { $set: { status: payload.status } },
    { new: true }
  );

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};
