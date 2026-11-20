import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Pokumon",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
