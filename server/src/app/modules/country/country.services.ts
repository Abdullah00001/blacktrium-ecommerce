import { CountryModel } from '@/app/schemas/country/country.schema';
import { TCountryQuery } from '@/app/modules/country/country.schemas';

export const getCountriesService = async ({
  query,
}: {
  query: TCountryQuery;
}): Promise<unknown> => {
  try {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { countryName: { $regex: search, $options: 'i' } },
        { countryCode: { $regex: search, $options: 'i' } },
      ];
    }

    if (status !== undefined) {
      filter.status = status;
    }

    const [data, total] = await Promise.all([
      CountryModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      CountryModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total: total,
        totalPages,
        links: {
          currentPage: page,
          nextPage: page < totalPages ? page + 1 : null,
          previousPage: page > 1 ? page - 1 : null,
          firstPage: 1,
          lastPage: totalPages || 1,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

export const updateCountryStatusService = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}): Promise<unknown> => {
  try {
    const result = await CountryModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!result) {
      throw new Error('Country not found');
    }
    return result;
  } catch (error) {
    throw error;
  }
};
