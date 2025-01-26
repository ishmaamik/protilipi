import { EdgeStoreProvider } from "@/lib/edgestore";
//import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  return (
    <div lang="en" className={inter.className}>
      <EdgeStoreProvider>{children}</EdgeStoreProvider>
    </div>
  );
}
