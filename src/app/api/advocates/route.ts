import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  // Validate pagination parameters
  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(Math.max(1, limit), 100); // Cap at 100 items per page

  const offset = (validatedPage - 1) * validatedLimit;

  // Uncomment this line to use a database with pagination
  // const data = await db.select().from(advocates).limit(validatedLimit).offset(offset);
  // const totalCount = await db.select({ count: sql`count(*)`.as('count') }).from(advocates);

  // For now, using in-memory data with pagination
  const data = advocateData.slice(offset, offset + validatedLimit);
  const totalCount = advocateData.length;
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
