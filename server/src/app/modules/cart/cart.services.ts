import { Types } from 'mongoose';
import { CartModel } from '@/app/schemas/cart/cart.schema';
import { ProductModel } from '@/app/schemas/product/product.schema';
import { ICart } from '@/app/schemas/cart/cart.types';
import { TAddToCart, TUpdateCartItem } from '@/app/modules/cart/cart.schemas';

// Get or Create Cart helper
const getOrCreateCart = async (userId: string): Promise<ICart> => {
  let cart = await CartModel.findOne({ userId: new Types.ObjectId(userId) }).populate('items.productId');
  if (!cart) {
    cart = await CartModel.create({ userId: new Types.ObjectId(userId), items: [], currency: 'Euros' });
  }
  return cart;
};

export const getCartService = async ({ userId }: { userId: string }): Promise<ICart> => {
  return await getOrCreateCart(userId);
};

export const addToCartService = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: TAddToCart;
}): Promise<ICart> => {
  const { productId, quantity, size, color } = payload;
  const productObjectId = new Types.ObjectId(productId);

  // 1. Fetch Product
  const product = await ProductModel.findById(productObjectId);
  if (!product) throw new Error('Product not found');

  // 2. Fetch User's Cart
  const cart = await getOrCreateCart(userId);

  // 3. Currency Check Logic
  if (cart.items.length === 0) {
    // If cart is empty, set its currency to the first product's currency
    cart.currency = product.currency;
  } else if (cart.currency !== product.currency) {
    // If cart has items and currency mismatches, throw the exact error warning requested!
    throw new Error('Please checkout the current currency products in your cart first.');
  }

  // 4. Stock Check
  if (product.stockQuantity < quantity) {
    throw new Error(`Insufficient stock. Only ${product.stockQuantity} left.`);
  }

  // 5. Add or Update Item in Cart
  // We check if the exact same product + variants exist to merge them
  const existingItemIndex = cart.items.findIndex(
    (item: any) => 
      item.productId._id.toString() === productId && 
      item.size === size && 
      item.color === color
  );

  if (existingItemIndex > -1) {
    // Add to existing quantity
    cart.items[existingItemIndex].quantity += quantity;
    if (product.stockQuantity < cart.items[existingItemIndex].quantity) {
      throw new Error(`Insufficient stock to add more of this item.`);
    }
  } else {
    // Push new item
    cart.items.push({
      productId: productObjectId,
      quantity,
      size,
      color,
    } as any);
  }

  await cart.save();
  return cart;
};

export const updateCartItemService = async ({
  userId,
  itemId,
  payload,
}: {
  userId: string;
  itemId: string;
  payload: TUpdateCartItem;
}): Promise<ICart> => {
  const cart = await CartModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!cart) throw new Error('Cart not found');

  const itemIndex = cart.items.findIndex((item: any) => item._id.toString() === itemId);
  if (itemIndex === -1) throw new Error('Item not found in cart');

  if (payload.quantity) {
    const product = await ProductModel.findById(cart.items[itemIndex].productId);
    if (!product) throw new Error('Product no longer exists');
    if (product.stockQuantity < payload.quantity) {
      throw new Error(`Insufficient stock. Only ${product.stockQuantity} left.`);
    }
    cart.items[itemIndex].quantity = payload.quantity;
  }

  if (payload.size) cart.items[itemIndex].size = payload.size;
  if (payload.color) cart.items[itemIndex].color = payload.color;

  await cart.save();
  return cart;
};

export const removeCartItemService = async ({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}): Promise<ICart> => {
  const cart = await CartModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter((item: any) => item._id.toString() !== itemId);

  await cart.save();
  return cart;
};

export const clearCartService = async ({ userId }: { userId: string }): Promise<ICart> => {
  const cart = await CartModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!cart) throw new Error('Cart not found');

  cart.items = [];
  await cart.save();
  return cart;
};
