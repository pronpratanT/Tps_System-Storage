"use client";

import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="App">
      {/* <Navbar session={session}/> */}
      <Sidebar session={session} />
    </main>
  );
}
