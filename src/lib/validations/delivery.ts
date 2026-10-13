import { z } from 'zod';

export const DeliveryRuleSchema = z.object({
  id: z.string().optional(),
  minDistanceKm: z.number().min(0, 'Min distance must be at least 0'),
  maxDistanceKm: z.number().positive('Max distance must be greater than 0'),
  deliveryFeePaise: z.number().int().min(0, 'Delivery fee cannot be negative'),
  freeDeliveryThresholdPaise: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(1),
}).refine(
  (data) => data.maxDistanceKm > data.minDistanceKm,
  {
    message: 'Max distance must be strictly greater than Min distance',
    path: ['maxDistanceKm'],
  }
);

export type DeliveryRuleInput = z.infer<typeof DeliveryRuleSchema>;
