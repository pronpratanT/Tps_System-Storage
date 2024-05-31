"use client";

import Sidebar from '../components/Sidebar';
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import CardList from '../components/CardList'; // Import CardList
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  background-color: #F6F6F6; /* Apply background color here */
`;

function WelcomePage() {
  const { data: session } = useSession();
  console.log(session);

  if (!session) {
    redirect("/login");
    return null; // Stop rendering content after redirect
  }

  return (
    <PageContainer>
      <Sidebar session={session} />
      <div className="flex-1 p-4">
        <h1>Welcome, {session.user.name}</h1>
        <p>Welcome to the dashboard. Here you can manage your account and settings.</p>

        <section>
          <h2>Profile Information</h2>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
        </section>

        <section>
          <h2>Account Settings</h2>
          <p>Manage your account settings and preferences here.</p>
        </section>

        <section>
          <h2>Team Members</h2>
          <CardList /> {/* Render CardList */}
        </section>
      </div>
    </PageContainer>
  );
}

export default WelcomePage;
