'use client';

import { Suspense } from 'react';
import {
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { invoiceApi } from '@/client-apis/invoiceApi';
import Pagination from '@/app/(ui)/dashboard/invoices/_components/pagination';
import Search from '@/app/(ui)/_components/search';
import Table from '@/app/(ui)/dashboard/invoices/_components/table';
import { CreateInvoice } from '@/app/(ui)/dashboard/invoices/_components/buttons';
import { lusitana } from '@/app/(ui)/fonts';
import { InvoicesTableSkeleton } from '@/app/(ui)/_components/skeletons';

export default function PageInner({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const invoices = useQuery({
    queryKey: ['invoices', searchParams],
    queryFn: () => invoiceApi.getAll(searchParams),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table invoices={invoices?.data?.data} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={invoices?.data?.totalPages} />
      </div>
    </div>
  );
}
