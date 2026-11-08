import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Siemens SimoCPQ - Industrial AI Product Configuration & Decision Support Agent',
  description: 'AI-driven CPQ and deterministic decision support system for Siemens SIMOTICS motors and SINAMICS drives.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#040911] text-slate-100 antialiased selection:bg-[#00ffb9] selection:text-black">
        {children}
      </body>
    </html>
  );
}
