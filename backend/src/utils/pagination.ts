export const buildPaginationMeta = (
  total: number,
  page: number,
  pageSize: number,
) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
