import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderSchema } from '@/lib/validations/order';
import { createOrder, getOrderByNumber } from '@/lib/services/orders';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = CreateOrderSchema.safeParse(body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed. Please check your order details.',
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { order, whatsappUrl } = await createOrder(parseResult.data);

    return NextResponse.json(
      {
        success: true,
        order,
        whatsappUrl,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while placing your order.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      );
    }

    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Order lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to look up order' },
      { status: 500 }
    );
  }
}
