import { Inter } from "next/font/google";
import styles from './page.module.css'; // Keep your custom CSS

// Initialize the font
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add any additional metadata or links here if needed */}
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
