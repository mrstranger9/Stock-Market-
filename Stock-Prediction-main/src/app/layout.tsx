'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth/auth-guard';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { RealtimeAlerts } from '@/components/ui/realtime-alerts';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/register';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>QuantAxis Pro</title>
        <meta name="description" content="Institutional Grade Trading Terminal" />
      </head>
      <body className="font-sans antialiased text-white bg-[#060B14]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            {children}
            <RealtimeAlerts />
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
