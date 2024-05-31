"use client";

import Sidebar from '../components/Sidebar';
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import CardList from '../components/CardList'; // Import CardList
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
        <UserTable/>
        
    </PageContainer>
  );
}

export default EmployeeID;
