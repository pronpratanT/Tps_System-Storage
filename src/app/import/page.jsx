"use client";

import Sidebar from "../../components/Sidebar";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import styled from "styled-components";
import ImportTable from "@/components/ImportTable";
import dynamic from 'next/dynamic';

const PageContainer = dynamic(() => import('../../components/StyledComponents').then(mod => mod.PageContainer), {
  ssr: false
});

function ImportPage() {
  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    if (!session) {
      redirect("/login");
      return null; // Stop rendering content after redirect
    }
  }, [session]);

  return (
    <PageContainer>
      <Sidebar session={session} />
      <div className="flex-1">
        <div className="bg-white h-16 px-4 shadow-sm"></div>
        <div className="p-4">
          <ImportTable />
        </div>
      </div>
    </PageContainer>
  );
}

export default ImportPage;
