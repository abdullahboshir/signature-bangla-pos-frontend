import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Container from "@/components/layouts/Container";
import Providers from "@/lib/providers/Providers";

const glatic = localFont({
  src: [
    {
      path: "../../public/fonts/Glatic-Bold.woff",
      weight: "400", 
      style: "normal",
    },
  ],
  variable: "--font-glatic",
});


export const metadata: Metadata = {
  title: "Signature Bangla POS",
  description: "Signature Bangla Point of Sale System",
  icons: {
    icon: "/favicon.ico",
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${glatic.variable}`}>
      <body className="font-sans">
        <Providers>
          <Container>{children}</Container>
        </Providers>
      </body>
    </html>
  );
}
