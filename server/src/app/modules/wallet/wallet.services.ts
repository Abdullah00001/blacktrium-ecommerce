import { Types } from 'mongoose';
import { WalletModel } from '@/app/schemas/wallet/wallet.schema';
import { IWallet } from '@/app/schemas/wallet/wallet.types';

export const getMyWalletService = async ({
  merchantId,
}: {
  merchantId: string;
}): Promise<IWallet> => {
  let wallet = await WalletModel.findOne({
    merchantId: new Types.ObjectId(merchantId),
  });

  if (!wallet) {
    // Auto-create wallet if it doesn't exist
    wallet = await WalletModel.create({
      merchantId: new Types.ObjectId(merchantId),
      balance: 0,
    });
  }

  return wallet;
};

export const connectStripeService = async ({
  merchantId,
  stripeAccountId,
}: {
  merchantId: string;
  stripeAccountId: string;
}): Promise<IWallet> => {
  const wallet = await WalletModel.findOneAndUpdate(
    { merchantId: new Types.ObjectId(merchantId) },
    { $set: { stripeAccountId } },
    { new: true, upsert: true }
  );

  return wallet;
};
