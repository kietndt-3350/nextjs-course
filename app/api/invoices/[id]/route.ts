import { sql } from "@vercel/postgres";
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";
import { InvoiceForm } from "@/app/lib/definitions";
import { UpdateInvoiceSchema } from "@/app/lib/invoices/schemas";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  noStore();

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${params.id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return Response.json(invoice[0]);
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(null, {
      status: 500,
      statusText: "Failed to fetch invoice by id.",
    });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  noStore();

  const formData = await request.formData()

  const validatedFields = UpdateInvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return Response.json({
      status: 400,
      message: 'Missing Fields. Failed to Update Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    });
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${params.id}
    `;

    revalidatePath('/dashboard/invoices');

    return Response.json({
      status: 200,
      message: 'Update Invoice successfully.',
    });
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(null, {
      status: 500,
      statusText: "Failed to fetch invoice by id.",
    });
  }
}
