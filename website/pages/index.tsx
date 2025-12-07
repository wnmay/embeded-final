import Head from "next/head";
import { Inter } from "next/font/google";
import React from "react";
import Main from "../components/main";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Head>
        <title>PlantCare - Smart Watering</title>
        <meta name="description" content="Published by MaMaTomYam" />
      </Head>
      <Main />
    </div>
  );
}
