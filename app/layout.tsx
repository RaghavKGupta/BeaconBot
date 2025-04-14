import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata = {
  title: "BeaconBot",
  description: "MGT 8803 - AI in Business - Georgia Tech - Raghav Gupta, Nigam Wadhwa, Ruhma Mehek Khan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
