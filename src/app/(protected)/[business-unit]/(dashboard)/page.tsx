import { redirect } from 'next/navigation';

export default function BusinessUnitRootPage({ params, searchParams }: { params: { 'business-unit': string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  // Redirect root access /:business-unit to /:business-unit/dashboard
  // Preserve query params (e.g. ?outlet=ID)
  const queryString = new URLSearchParams(searchParams as any).toString();
  const destination = `/${params['business-unit']}/dashboard${queryString ? `?${queryString}` : ''}`;

  redirect(destination);
}
