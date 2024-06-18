"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const PageContainer = styled.div`
  display: flex;
  background-color: #f6f6f6;
`;

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      redirect("/login");
      return null; // Stop rendering content after redirect
    }
  }, []);

  return (
    <PageContainer>
      <Sidebar session={session} />
      <div className="flex-1">
        <div className="bg-white h-16 px-4 shadow-sm"></div>
        {/* <UserProfile session={session} /> */}
      </div>
    </PageContainer>
  );
}
