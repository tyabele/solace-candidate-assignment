import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const search = searchParams.get('search') || '';

  // Validate pagination parameters
  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(Math.max(1, limit), 100); // Cap at 100 items per page

  // Apply search filter first
  let filteredData = advocateData;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = advocateData.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.specialties.some(s => s.toLowerCase().includes(searchLower)) ||
        advocate.yearsOfExperience.toString().includes(search)
      );
    });
  }

  const offset = (validatedPage - 1) * validatedLimit;
  const data = filteredData.slice(offset, offset + validatedLimit);
  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / validatedLimit);
  const hasNextPage = validatedPage < totalPages;
  const hasPreviousPage = validatedPage > 1;

  return Response.json({
    data,
    pagination: {
      page: validatedPage,
      limit: validatedLimit,
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  });
}
