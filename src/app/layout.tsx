import ChartRegistry from '@/components/ChartRegistry';
import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChartRegistry />
        {children}
      </body>
    </html>
  );
}