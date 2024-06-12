"use client";

import Sidebar from '@/app/components/Sidebar';
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styled from 'styled-components';
import UserTable from '../components/EmployeeTable';

const PageContainer = styled.div`
  display: flex;
  background-color: #F6F6F6; /* Apply background color here */
`;

function EmployeeID() {
  const { data: session } = useSession();
  console.log(session);

  if (!session) {
    redirect("/login");
    return null; // Stop rendering content after redirect
  }

  return (
    <PageContainer>
      <Sidebar session={session} />
      <div className="flex-1">
        <div className="bg-white h-16 px-4 shadow-sm"></div>
        {/* <UserProfile session={session} /> */}
        <div className="p-4">
          <UserTable />
        </div>
      </div>
    </PageContainer>
  );
}

export default EmployeeID;
