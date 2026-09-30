import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export const SHOP_DETAILS = {
  nameTamil: 'நம்ம நுங்கு கடை',
  nameEnglish: 'SVS FRESH JUICE POINT',
  tagline: 'Freshness, Naturally.',
  phones: ['9442478101', '7598430795'],
  displayPhones: ['94424 78101', '75984 30795'],
  whatsappNumber: '9442478101',
  location: 'Loyola College Road, Thirumalapuram',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Loyola+College+Road+Thirumalapuram',
};
