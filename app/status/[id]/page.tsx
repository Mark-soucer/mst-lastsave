import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StatusPage from '@/components/status/StatusPage';
import { getRepairOrder } from '@/lib/repair-orders/repository';

type StatusRouteProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: StatusRouteProps): Promise<Metadata> {
  const order = await getRepairOrder(params.id);

  return {
    title: order
      ? `Status comandă #${order.orderNumber} | MST Service`
      : 'Status comandă | MST Service',
    description: order
      ? `Statusul actual al comenzii #${order.orderNumber} (${order.vehicle.brand} ${order.vehicle.model}).`
      : 'Verifică statusul comenzii tale auto la MST Service.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function StatusRoute({ params }: StatusRouteProps) {
  const order = await getRepairOrder(params.id);

  if (!order) {
    notFound();
  }

  return <StatusPage order={order} />;
}

