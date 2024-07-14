"use client";

import Sidebar from "@/components/Sidebar";
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const PageContainer = dynamic(() => import('@/components/StyledComponents').then(mod => mod.PageContainer), {
  ssr: false
});

function ProductID() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = session.user?.role;
      if (userRole !== "MEMBER" && userRole !== "ADMIN") {
        alert("ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        router.push("/welcome");
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  if (session.user?.role !== "MEMBER" && session.user?.role !== "ADMIN") {
    return null; // หรือแสดงข้อความแจ้งเตือนอื่นๆ
  }

  return (
    <PageContainer>
      <Sidebar session={session} />
      <div className='flex-1'>
        <div className="bg-white h-16 px-4 shadow-sm"></div>
        <div className="p-4"><ProductTable /></div>
      </div>
    </PageContainer>
  );
}

export default ProductID;