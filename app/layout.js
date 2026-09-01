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
  title: "Dayanch's Blog | dayanch.dev",
  description:
    "Explore software development insights, Go/Node.js tutorials, and developer experiences shared by Dayanch. Learn and grow with real-world coding tips.",
  openGraph: {
    title: "Dayanch's Blog | dayanch.dev",
    description:
      "Explore software development insights, Go/Node.js tutorials, and developer experiences shared by Dayanch.",
    url: "https://dayanch.dev/blog",
    siteName: "dayanch.dev",
    images: [
      {
        url: "https://dayanch.dev/og.png",
        width: 800,
        height: 600,
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dayanch's Blog | dayanch.dev",
    description:
      "Explore software development insights, Go/Node.js tutorials, and developer experiences shared by Dayanch.",
    images: ["/og.png"],
  },
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
