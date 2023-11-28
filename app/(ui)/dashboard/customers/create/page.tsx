import { Metadata } from 'next';
import Form from '@/app/(ui)/dashboard/invoices/create/create-form';
import Breadcrumbs from '@/app/(ui)/_components/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Create Invoices',
};
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}