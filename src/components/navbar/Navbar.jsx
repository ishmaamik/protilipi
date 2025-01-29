"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

const links = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "লিপিকথা",
    url: "/LipiKotha",
  },
  {
    id: 3,
    title: "একুশেAI",
    url: "/EkusheAI",
  },
  {
    id: 4,
    title: "আলাপন",
    url: "/collab",
  },
  {
    id: 5,
    title: "কানন",
    url: "/blog",
  },
  {
    id: 6,
    title: "ছবিগল্প",
    url: "/protected",
  },
  {
    id: 7,
    title: "PDFগল্প",
    url: "/pdf",
  },
  {
    id: 8,
    title: "ছবি",
    url: "/uploadImage",
  },
  {
    id: 9,
    title: "About",
    url: "/about",
  },
  {
    id: 10,
    title: "Contact",
    url: "/contact",
  },
  {
    id: 11,
    title: "Dashboard",
    url: "/dashboard",
  },
  
];

const Navbar = () => {
  const session = useSession();

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
      অংকুর
      </Link>
      <div className={styles.links}>
        <DarkModeToggle />
        {links.map((link) => (
          <Link key={link.id} href={link.url} className={styles.link}>
            {link.title}
          </Link>
        ))}
        {session.status === "authenticated" && (
          <button className={styles.logout} onClick={signOut}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
