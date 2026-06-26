import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  getCountriesService,
  updateCountryStatusService,
} from '@/app/modules/country/country.services';
import {
  TCountryQuery,
  TUpdateCountryStatus,
} from '@/app/modules/country/country.schemas';

export const getCountriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = (req as any).validatedQuery as TCountryQuery;

    const data = await getCountriesService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Retrieve countries successful',
      data,
      traceId,
    });
  }
);

export const updateCountryStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const { status } = req.body as TUpdateCountryStatus;

    const data = await updateCountryStatusService({ id, status });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Country status updated successfully',
      data,
      traceId,
    });
  }
);
