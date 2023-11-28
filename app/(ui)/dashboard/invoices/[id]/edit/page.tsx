import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Form from '@/app/(ui)/dashboard/invoices/[id]/edit/edit-form';
import Breadcrumbs from '@/app/(ui)/_components/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Update Invoices',
};
 
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/(ui)/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/(ui)/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}