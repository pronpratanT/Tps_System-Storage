import React from 'react';
import Card from './Card';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';

const CardListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;


const users = [
  {
    name: 'Jane Cooper',
    position: 'Regional Paradigm Technician',
  },
  {
    name: 'Cody Fisher',
    position: 'Product Directives Officer',
  },
  {
    name: 'Esther Howard',
    position: 'Forward Response Developer',
  },
  {
    name: 'Jenny Wilson',
    position: 'Central Security Manager',
  },
  {
    name: 'Kristin Watson',
    position: 'Lead Implementation Liaison',
  },
  {
    name: 'Cameron Williamson',
    position: 'Internal Applications Engineer',
  },
];

const CardList = () => {
  return (
    <CardListContainer>
      {users.map((user, index) => (
        <Card
          key={index}
          name={user.name}
          position={user.position}
        />
      ))}
    </CardListContainer>
  );
};

export default CardList;
