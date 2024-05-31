import React from 'react';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';

const CardContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
`;

// ลบ Avatar เดิม
// const Avatar = styled.img`
//   border-radius: 50%;
//   width: 50px;
//   height: 50px;
//   margin-right: 20px;
// `;

const Badge = styled.span`
  background: #e0ffe0;
  color: #34a853;
  padding: 5px 10px;
  border-radius: 5px;
  margin-left: 10px;
  font-size: 0.8em;
`;

const CardBody = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 1em;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Card = ({ name, position, avatar }) => {
  const userInitial = name?.charAt(0).toUpperCase() || 'U'; // ดึงค่า userInitial จาก name
  
  return (
    <CardContainer>
      <CardHeader>
        <Avatar sx={{ bgcolor: deepOrange[500], marginRight: '20px' }} variant="rounded-md">
          {userInitial}
        </Avatar>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>{name}</h2>
            <Badge>Admin</Badge>
          </div>
          <p className="text-gray-600 text-xs">{position}</p>
        </div>
      </CardHeader>
      <CardBody>
        <button className='text-[#8146FF]'>Edit</button>
        <button className="text-red-600">Delete</button>
      </CardBody>
    </CardContainer>
  );
};

export default Card;
