import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { invoiceApi } from '@/client-apis/invoiceApi';
import PageInner from "./_components/pageInner";

export const metadata: Metadata = {
  title: 'Invoices',
};
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['invoices', searchParams],
    queryFn: () => invoiceApi.getAll(searchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageInner searchParams={searchParams} />
    </HydrationBoundary>
  );
}
