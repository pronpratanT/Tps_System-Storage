"use client";

import Sidebar from "./components1/Sidebar";
import Navbar from "./components1/Navbar";
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
