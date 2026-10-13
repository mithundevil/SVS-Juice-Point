import { z } from 'zod';

export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive('Quantity must be greater than 0').max(100, 'Max quantity is 100'),
  withIceCream: z.boolean().default(false),
});

export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerPhone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  orderType: z.enum(['delivery', 'pickup']),
  deliveryAddress: z.string().max(300).optional().default(''),
  landmark: z.string().max(100).optional().default(''),
  customerNotes: z.string().max(500).optional().default(''),
  paymentMethod: z.enum(['cod', 'upi']).default('cod'),
  items: z.array(OrderItemSchema).min(1, 'Cart must have at least one item'),
  clientDistanceKm: z.number().nonnegative().optional().nullable(),
}).refine(
  (data) => {
    if (data.orderType === 'delivery') {
      return data.deliveryAddress && data.deliveryAddress.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Delivery address is required for delivery orders',
    path: ['deliveryAddress'],
  }
);

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
