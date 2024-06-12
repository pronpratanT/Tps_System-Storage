"use client";

import Sidebar from "./componentsอันนี้คืออันเดิมสามรถลบได้/Sidebar";
import Navbar from "./componentsอันนี้คืออันเดิมสามรถลบได้/Navbar";
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
