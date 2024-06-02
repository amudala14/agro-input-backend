import { Model, PopulateOptions } from 'mongoose';

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  populate?: (string | PopulateOptions)[];
}

export async function findWithPagination<T>(
  model: Model<T>,
  options: PaginationOptions,
): Promise<T[]> {
  const { page, limit, sortBy, sortOrder, populate } = options;
  const query = model
    .find()
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // Check if populate is defined and iterate over each item correctly
  if (populate) {
    populate.forEach((pop) => {
      if (typeof pop === 'string') {
        query.populate(pop);
      } else if (typeof pop === 'object' && 'path' in pop) {
        query.populate(pop);
      }
    });
  }

  return query.exec();
}
