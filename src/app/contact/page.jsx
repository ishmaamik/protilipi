"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";

const Contact = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session");
        const session = await response.json();

        if (!session.isLoggedIn || session.isBlocked) {
          router.replace("/"); // Redirect to home if not logged in or blocked
        } else {
          setIsLoading(false); // Allow rendering if session is valid
        }
      } catch (err) {
        console.error("Error checking session:", err);
        router.replace("/"); // Redirect on error
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) return null; // Prevent rendering until session is validated

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Let&rsquo;s Keep in Touch</h1>
      <div className={styles.content}>
        <div className={styles.imgContainer}>
          <Image
            src="/contact.png"
            alt="Contact"
            fill={true}
            className={styles.image}
          />
        </div>
        <form className={styles.form}>
          <input type="text" placeholder="name" className={styles.input} />
          <input type="email" placeholder="email" className={styles.input} />
          <textarea
            className={styles.textArea}
            placeholder="message"
            cols="30"
            rows="10"
          ></textarea>
          <Button url="#" text="Send" />
        </form>
      </div>
    </div>
  );
};

export default Contact;
