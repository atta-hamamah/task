import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build Your Security System | Wyze Bundle Builder",
  description:
    "Customize your Wyze home security system. Choose cameras, plans, sensors, and accessories to build the perfect bundle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 leading-normal">
        {children}
      </body>
    </html>
  );
}
