import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileCartBar } from '@/components/MobileCartBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SVS Fresh Juice Point | Fresh Juices, Nungu & Ilaneer | Thirumalapuram',
  description:
    'Order fresh juices, nungu, ilaneer, milkshakes, sarbath, ice creams and more from SVS Fresh Juice Point, Loyola College Road, Thirumalapuram.',
  keywords: [
    'SVS Fresh Juice Point',
    'நம்ம நுங்கு கடை',
    'Nungu Juice Thirumalapuram',
    'Ilaneer Sarbath',
    'Loyola College Road Juice Shop',
    'Fresh Juice Delivery',
    'Milkshake Thirumalapuram',
  ],
  authors: [{ name: 'SVS Fresh Juice Point' }],
  openGraph: {
    title: 'SVS Fresh Juice Point | நம்ம நுங்கு கடை',
    description:
      'Order fresh juices, nungu, ilaneer, milkshakes, sarbath, ice creams and more from SVS Fresh Juice Point, Loyola College Road, Thirumalapuram.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileCartBar />
        </CartProvider>
      </body>
    </html>
  );
}
