"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import styled from "styled-components";
import dynamic from 'next/dynamic';
import Sidebar from "@/components/Sidebar";

// Dynamic imports with SSR disabled
const ChartUserRole = dynamic(() => import('@/components/ChartUserRole'), { ssr: false });
const CountStatIXPort = dynamic(() => import('@/components/CountStatIXPort'), { ssr: false });
const ChartCombined = dynamic(() => import('@/components/ChartCombined'), { ssr: false });

const PageContainer = styled.div`
  display: flex;
  background-color: #f6f6f6;
`;

function WelcomePage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      redirect("/login");
    }
  }, [session]);

  if (!session) {
    return null; // Don't render anything if there's no session
  }

  return (
    <PageContainer>
      <Sidebar session={session} />
      <div className="flex-1">
        <div className="bg-white h-16 px-4 shadow-sm"></div>
        <div className="flex-1 p-4">
          <ChartUserRole />
          <CountStatIXPort />
          <ChartCombined />
        </div>
      </div>
    </PageContainer>
  );
}

export default WelcomePage;