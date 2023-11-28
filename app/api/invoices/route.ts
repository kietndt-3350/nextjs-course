import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";
import { InvoicesTable } from "@/app/lib/definitions";

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  noStore();
  const searchParams = request.nextUrl.searchParams;
  const offset = (+(searchParams.get('page') || 1) - 1) * ITEMS_PER_PAGE;
  const query = searchParams.get('query') || '';

  try {
    const getInvoicesQuery = sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const getInvoiceCountQuery = sql`
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

    const [invoices, invoiceCount] = await Promise.all([
      getInvoicesQuery,
      getInvoiceCountQuery,
    ]);

    return Response.json({
      data: invoices.rows,
      totalPages: Math.ceil(Number(invoiceCount?.rows?.[0]?.count) / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response(null, {
      status: 500,
      statusText: "Failed to fetch the latest invoices.",
    });
  }
}
