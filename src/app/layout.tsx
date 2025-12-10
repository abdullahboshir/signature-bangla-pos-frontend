import type { Metadata } from "next";
import "./globals.css";
import Container from "@/components/layouts/Container";
import Providers from "@/lib/providers/Providers";



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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <Container>{children}</Container>
        </Providers>
      </body>
    </html>
  );
}
