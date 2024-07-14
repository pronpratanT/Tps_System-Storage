"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import styled from "styled-components";
import VendorTable from "@/components/VendorTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const PageContainer = styled.div`
  display: flex;
  background-color: #f6f6f6;
`;

export default function VendorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else {
      const userRole = session.user?.role;
      if (userRole !== "MEMBER" && userRole !== "ADMIN") {
        alert("ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        router.push("/welcome");
      }
    }
  }, [session, status, router]);

  if (status === "loading" || !session || (session.user?.role !== "MEMBER" && session.user?.role !== "ADMIN")) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <Sidebar session={session} />
      <div className="flex-1">
        <div className="bg-white h-16 px-4 shadow-sm"></div>
        <div className="p-4">
          <VendorTable />
        </div>
      </div>
    </PageContainer>
  );
}