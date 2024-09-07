import { AuthProvider } from './contexts/authcontexts'; // Adjust the path if necessary
import Header from './components/navbar'; // Adjust the path if necessary
import { Inter } from 'next/font/google';
import './globals.css';
import * as React from "react";

// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
      <AuthProvider>
        <NextUIProvider>
          {children}
          </NextUIProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
