import { redirect } from 'next/navigation';

export default function BusinessUnitRootPage({ params }: { params: { 'business-unit': string } }) {
  // Redirect root access /:business-unit to /:business-unit/dashboard
  redirect(`/${params['business-unit']}/dashboard`);
}
