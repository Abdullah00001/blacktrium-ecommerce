import { Schema, model, Model } from 'mongoose';
import { IFavorite } from '@/favorite/favorite.types';

const FavoriteSchema = new Schema<IFavorite>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemType: { type: String, enum: ['business', 'product'], required: true, index: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'BusinessProfile', index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', index: true },
}, {
  timestamps: true
});

export const FavoriteModel: Model<IFavorite> = model<IFavorite>('Favorite', FavoriteSchema);
