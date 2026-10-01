import { createMetadata } from '@/lib/metadata';
import "./globals.css";
import Header from "@/components/layouts/Header/Header";
import { Geist, Space_Grotesk } from "next/font/google"
import { Providers } from "@/components/Theme/Theme";


const title = Geist({
  subsets: ['latin'],
  variable: "--font-geist"
});

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: "--font-space-grotesk"
});

export const metadata = {
  metadataBase: new URL("https://dayanch.dev"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  ...createMetadata({
    title: 'Dayanch | Software Developer',
    description: 'I build software, explore ideas, and contribute to open source. Discover my projects, development notes, and reading shelf.',
    url: '/',
  }),
};
export default function RootLayout({ children }) {
  return (
 <html lang="en" suppressHydrationWarning>
      <body
        className={`${title.className} ${display.variable} flex min-h-screen flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          
          <main className="flex-grow body-texture relative">
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
