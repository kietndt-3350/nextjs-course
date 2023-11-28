import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";
import { CustomersTable, CustomerField } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  noStore();
  const searchParams = request.nextUrl.searchParams;
  const offset = (+(searchParams.get('page') || 1) - 1) * ITEMS_PER_PAGE;
  const query = searchParams.get('query') || '';

  try {
    if (offset && query) {
      const data = await sql<CustomersTable>`
        SELECT *
        FROM (
          SELECT
            customers.id,
            customers.name,
            customers.email,
            customers.image_url,
            COUNT(invoices.id) AS total_invoices,
            SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
            SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
          FROM customers
          LEFT JOIN invoices ON customers.id = invoices.customer_id
          GROUP BY customers.id, customers.name, customers.email, customers.image_url
        ) AS subquery
        WHERE
          name ILIKE ${`%${query}%`} OR
          email ILIKE ${`%${query}%`} OR
          total_invoices::text ILIKE ${`%${query}%`} OR
          total_pending::text ILIKE ${`%${query}%`} OR
          total_paid::text ILIKE ${`%${query}%`}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
      `;

      const customers = data.rows.map((customer) => ({
        ...customer,
        total_pending: formatCurrency(customer.total_pending),
        total_paid: formatCurrency(customer.total_paid),
      }));

      return Response.json(customers);
    } else {
      const data = await sql<CustomerField>`
        SELECT
          id,
          name
        FROM customers
        ORDER BY name ASC
      `;

      const customers = data.rows;
      return Response.json(customers);
    }
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(null, {
      status: 500,
      statusText: "Failed to fetch all customers.",
    });
  }
}
