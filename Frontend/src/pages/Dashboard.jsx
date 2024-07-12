import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import Card from "../components/card";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <DashboardContainer>
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MainContent>
        <h1>Dashboard</h1>
        <CardsContainer>
          <Card title="Followers" count={120} />
          <Card title="Followings" count={80} />
          <Card title="Bookmarks" count={50} />
          <Card title="Medium Posts" count={10} />
          <Card title="Dev.to Posts" count={15} />
          <Card title="Hashnode Posts" count={5} />
          <Card title="Total Posts" count={30} />
        </CardsContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
const DashboardContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #f0f2f5;

  h1 {
    margin-top: 20px;
    padding: 20px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
`;
