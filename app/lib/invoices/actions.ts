'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
import { CreateInvoiceSchema, UpdateInvoiceSchema } from './schemas';

export type State = {
  status?: string | null;
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // const rawFormData = Object.fromEntries(formData.entries())
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };

  const validatedFields = CreateInvoiceSchema.safeParse(rawFormData);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      status: 'rejected',
      message: 'Missing Fields. Failed to Create Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const today = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${today})
    `;
  } catch (error) {
    return {
      status: 'rejected',
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Clear Invoices page's cache and trigger a new request to the server to rerender Invoices page
  revalidatePath('/dashboard/invoices');

  return {
    status: 'success',
    message: 'Create Invoice successfully.',
  }

  // Redirect to Invoices page
  // redirect('/dashboard/invoices'); // This will throw an error so must put it outside of try catch block
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      status: 'rejected',
      message: 'Missing Fields. Failed to Update Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');

    return {
      status: 'success',
      message: 'Update Invoice successfully.',
    }
  } catch (error) {
    return {
      status: 'rejected',
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  // redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return {
      status: 'rejected',
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  
  return {
    status: 'success',
    message: 'Deleted Invoice successfully.'
  };
}
