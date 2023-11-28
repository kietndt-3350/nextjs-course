import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Form from '@/app/(ui)/dashboard/invoices/[id]/edit/edit-form';
import Breadcrumbs from '@/app/(ui)/_components/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { invoiceApi } from '@/client-apis/invoiceApi';
import { customerApi } from '@/client-apis/customerApi';

export const metadata: Metadata = {
  title: 'Update Invoices',
};
 
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['customers'],
      queryFn: () => customerApi.getAll(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['invoice', id],
      queryFn: () => invoiceApi.getById(id),
    }),
  ]);

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
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Form id={id} />
      </HydrationBoundary>
    </main>
  );
}