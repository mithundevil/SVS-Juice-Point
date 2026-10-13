import { z } from 'zod';

export const UpdatePriceSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  pricePaise: z.number().int().positive('Price in paise must be positive integer'),
});

export const UpdateAvailabilitySchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  isAvailable: z.boolean(),
});

export const SaveProductSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required').max(100),
  tamilName: z.string().max(100).nullable().optional(),
  description: z.string().max(500).optional().default(''),
  imageUrl: z.string().min(1, 'Image URL is required'),
  pricingType: z.enum(['fixed', 'weight']).default('fixed'),
  unit: z.enum(['serving', 'kg', 'piece', 'glass', 'gram']).default('serving'),
  isAvailable: z.boolean().default(true),
  allowIceCreamAddon: z.boolean().default(false),
  popular: z.boolean().default(false),
  pricePaise: z.number().int().positive('Price must be a positive number'),
});

export type UpdatePriceInput = z.infer<typeof UpdatePriceSchema>;
export type SaveProductInput = z.infer<typeof SaveProductSchema>;
