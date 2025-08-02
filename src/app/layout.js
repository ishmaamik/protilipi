import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

// Fallback font config
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  display: 'swap',
  fallback: ['sans-serif']
});

export const metadata = {
  title: "IUT_ACCESS_DENIED",
  description: "This is the description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          src="https://widget.cloudinary.com/v2.0/global/all.js" 
          strategy="lazyOnload"
        />
      </head>
      <body className={`${inter.className} ${bengali.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="container">
              <Navbar />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
