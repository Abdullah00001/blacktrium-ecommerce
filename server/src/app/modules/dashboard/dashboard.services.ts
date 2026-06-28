import { UserModel } from '@/app/schemas/user/user.schema';
import { MerchantModel } from '@/app/schemas/merchant/merchant.schema';
import { OrderModel } from '@/app/schemas/order/order.schema';
import { CategoryModel } from '@/app/schemas/category/category.schema';
import { Role, AccountStatus } from '@/app/schemas/user/user.types';

export const getAdminDashboardOverviewService = async (query: { chartType?: string, year?: string }) => {
  const chartType = query.chartType || 'Business'; // 'Business' or 'Users'
  const year = parseInt(query.year || new Date().getFullYear().toString(), 10);
  
  // 1. Total Active Users
  const totalActiveUsers = await UserModel.countDocuments({ role: Role.USER, accountStatus: AccountStatus.ACTIVE });

  // 2. Total Businesses
  const totalBusinesses = await MerchantModel.countDocuments();

  // 3. Total Earning (Sum of all orders total)
  const earningsAgg = await OrderModel.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$paymentInfo.total' } } }
  ]);
  const totalEarning = earningsAgg.length > 0 ? earningsAgg[0].total : 0;

  // 4. Platform Analytics Chart (Monthly data for selected year)
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
  const monthlyData = new Array(12).fill(0);

  if (chartType === 'Business') {
    const bizAgg = await MerchantModel.aggregate([
      { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } }
    ]);
    bizAgg.forEach(item => { monthlyData[item._id - 1] = item.count; });
  } else {
    // Users
    const userAgg = await UserModel.aggregate([
      { $match: { role: Role.USER, createdAt: { $gte: startOfYear, $lte: endOfYear } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } }
    ]);
    userAgg.forEach(item => { monthlyData[item._id - 1] = item.count; });
  }

  // 5. Category List (Top 5 Categories with subcategory counts)
  const categoryList = await CategoryModel.aggregate([
    {
      $lookup: {
        from: 'subcategories',
        localField: '_id',
        foreignField: 'categoryId',
        as: 'subCategories'
      }
    },
    {
      $project: {
        categoryName: 1,
        categoryImage: 1,
        subCategoryCount: { $size: '$subCategories' }
      }
    },
    { $sort: { subCategoryCount: -1 } },
    { $limit: 5 }
  ]);

  // 6. New Users (Last 5 users with Profile avatar)
  // Instead of complex lookup, we can do a find and populate manually or using aggregate. Let's do aggregate.
  const newUsers = await UserModel.aggregate([
    { $match: { role: Role.USER } },
    { $sort: { createdAt: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'profiles',
        localField: '_id',
        foreignField: 'userId',
        as: 'profile'
      }
    },
    {
      $project: {
        id: '$_id',
        firstName: 1,
        lastName: 1,
        joinDate: '$createdAt',
        status: '$accountStatus',
        avatar: { $arrayElemAt: ['$profile.profileAvatar', 0] }
      }
    }
  ]);

  return {
    overview: {
      totalActiveUsers,
      totalBusinesses,
      totalEarning
    },
    platformAnalytics: monthlyData,
    categoryList,
    newUsers
  };
};
