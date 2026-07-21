import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CubeX — Learn to Solve a Rubik's Cube",
  description: "Interactive 3D lessons for solving the 3x3 Rubik's Cube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
