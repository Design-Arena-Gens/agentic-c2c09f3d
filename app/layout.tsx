import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Order Reminder System',
  description: '10 दिन बाद automatic email और WhatsApp reminder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
