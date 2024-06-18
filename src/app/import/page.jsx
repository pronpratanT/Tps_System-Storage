"use client";

import Sidebar from "../../components/Sidebar";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import styled from "styled-components";
import ImportTable from "@/components/ImportTable";

const PageContainer = styled.div`
  display: flex;
  background-color: #f6f6f6;
`;

function ImportPage() {
  const { data: session } = useSession();
  console.log(session);

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
        <div className="p-4">
          <ImportTable />
        </div>
      </div>
    </PageContainer>
  );
}

export default ImportPage;
