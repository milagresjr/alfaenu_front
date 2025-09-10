import { Outfit } from 'next/font/google';
import './globals.css';
import './app.css';
import './react-quill.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import QueryProvider from '@/provider/queryProvider';
import { ProgressProviderWrapper } from '@/provider/progressProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ProgressProviderWrapper>
          <QueryProvider>
            <ThemeProvider>
              <SidebarProvider>
                {children}
                <ToastContainer
                  position="top-right"
                  style={{ zIndex: '99999999' }}
                  autoClose={2000}
                  theme="colored"
                />
              </SidebarProvider>
            </ThemeProvider>
          </QueryProvider>
        </ProgressProviderWrapper>
      </body>
    </html>
  );
}
