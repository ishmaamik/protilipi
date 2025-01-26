"use client";

import React, { useContext } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import pngeggLight from "../../public/pngegg.png"; // Light mode image
import pngeggDark from "../../public/pngegg2.png"; // Dark mode image
import Button from "@/components/Button/Button";
import { ThemeContext } from "@/context/ThemeContext";

const Home = () => {
  const { mode } = useContext(ThemeContext);

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>
        আমাদের ভাষা, আমাদের শক্তি – অংকুর অ্যাপ
        </h1>
        <p className={styles.desc}>
        বাংলা ও বাংলিশের মাঝে সেতু বন্ধন। সহজে লিখুন, শিখুন এবং সংরক্ষণ করুন।
        </p>
        <Button url="/dashboard/login" text="শুরু করি" />
      </div>
      <div className={styles.item}>
        {/* Dynamically choose the image based on the theme */}
        <Image
          src={mode === "light" ? pngeggLight : pngeggDark}
          alt="Theme-based illustration"
          className={styles.img}
        />
      </div>
    </div>
  );
};

export default Home;
