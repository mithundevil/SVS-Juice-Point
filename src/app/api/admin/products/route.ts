import { NextRequest, NextResponse } from 'next/server';
import { verifyOwnerSession } from '@/lib/services/auth';
import { 
  getAllProductsAdmin, 
  updateProductPrice, 
  toggleProductAvailability,
  upsertProduct 
} from '@/lib/services/products';
import { 
  UpdatePriceSchema, 
  UpdateAvailabilitySchema, 
  SaveProductSchema 
} from '@/lib/validations/product';

export async function GET(req: NextRequest) {
  const session = await verifyOwnerSession();
  if (!session && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const products = await getAllProductsAdmin();
  return NextResponse.json({ success: true, products });
}

export async function POST(req: NextRequest) {
  const session = await verifyOwnerSession();
  if (!session && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'update_price') {
      const parseResult = UpdatePriceSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid price input', details: parseResult.error.flatten() },
          { status: 400 }
        );
      }

      const res = await updateProductPrice(
        parseResult.data.productId,
        parseResult.data.pricePaise,
        session?.user?.id
      );

      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'toggle_availability') {
      const parseResult = UpdateAvailabilitySchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid availability input', details: parseResult.error.flatten() },
          { status: 400 }
        );
      }

      const res = await toggleProductAvailability(
        parseResult.data.productId,
        parseResult.data.isAvailable
      );

      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'save_product') {
      const parseResult = SaveProductSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid product input', details: parseResult.error.flatten() },
          { status: 400 }
        );
      }

      const res = await upsertProduct({
        ...parseResult.data,
        updatedBy: session?.user?.id,
      });

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
    console.error('Admin product error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}
