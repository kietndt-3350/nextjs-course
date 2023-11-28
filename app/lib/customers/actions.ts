'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateCustomerSchema, UpdateCustomerSchema } from './schemas';

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export async function createCustomer(prevState: State, formData: FormData) {
  // const rawFormData = Object.fromEntries(formData.entries())
  const rawFormData = {
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  };

  const validatedFields = CreateCustomerSchema.safeParse(rawFormData);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }

  const { name, email, image_url } = validatedFields.data;

  try {
    await sql`
      INSERT INTO customers (name, email, image_url, date)
      VALUES (${name}, ${email}, ${image_url})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  // Clear Invoices page's cache and trigger a new request to the server to rerender Invoices page
  revalidatePath('/dashboard/customers');

  // Redirect to Invoices page
  redirect('/dashboard/customers'); // This will throw an error so must put it outside of try catch block

}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateCustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { name, email, image_url } = validatedFields.data;
 
  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Customer.',
    };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted Customer successfully.' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Customer.',
    };
  }
}
