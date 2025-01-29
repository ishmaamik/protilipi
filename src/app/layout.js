import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter, Roboto, Poppins } from "next/font/google";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IUT_ACCESS_DENIED",
  description: "This is the description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts for Noto Sans Bengali */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali&display=swap"
          rel="stylesheet"
        />
        {/* Cloudinary Widget Script */}
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          async
        ></script>
      </head>
      <body className={inter.className}>
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
