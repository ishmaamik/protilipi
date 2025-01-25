import { Inter } from "next/font/google";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  return (
    <div className={`${inter.className} ${styles.container}`} style={{ backgroundColor: "black" }}>
      {children}
    </div>
  );
}
