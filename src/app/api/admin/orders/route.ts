import { NextRequest, NextResponse } from 'next/server';
import { verifyOwnerSession } from '@/lib/services/auth';
import { 
  getOrdersAdmin, 
  updateOrderStatus, 
  updateOrderDistanceAndFee, 
  OrderStatus 
} from '@/lib/services/orders';

export async function GET(req: NextRequest) {
  const session = await verifyOwnerSession();
  if (!session && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const result = await getOrdersAdmin({ status, search, page, limit });
  return NextResponse.json({ success: true, ...result });
}

export async function PATCH(req: NextRequest) {
  const session = await verifyOwnerSession();
  if (!session && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, orderId, status, distanceKm, deliveryFeePaise } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (action === 'update_status') {
      if (!status) {
        return NextResponse.json(
          { success: false, error: 'Status is required' },
          { status: 400 }
        );
      }

      const res = await updateOrderStatus(orderId, status as OrderStatus);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'update_distance_fee') {
      if (distanceKm === undefined || deliveryFeePaise === undefined) {
        return NextResponse.json(
          { success: false, error: 'distanceKm and deliveryFeePaise are required' },
          { status: 400 }
        );
      }

      const res = await updateOrderDistanceAndFee(orderId, Number(distanceKm), Number(deliveryFeePaise));
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
