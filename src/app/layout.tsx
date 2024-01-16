import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './_trpc/Provider'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Taichung Bus',
  description: 'A web which is specified for bus transportation in Taichung City, Taiwan.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
      <Toaster />
    </html>
  )
}
