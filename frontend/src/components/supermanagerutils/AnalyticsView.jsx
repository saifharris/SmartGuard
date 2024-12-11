import React from "react";
import styled from "styled-components";
import Histogram from "../adminutils/Histogram";
import PieChart from "../adminutils/PieChart";
import LineChart from "../adminutils/LineChart";
import FunnelChart from "../adminutils/Funnel";
import { IoMdAnalytics } from "react-icons/io";

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
  position: relative;
  padding: 2rem;
  box-sizing: border-box;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  font-size: 2.5rem;
  color: #1a1a2e;
  font-weight: bold;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  }

  /* Accent bar using the manager analytics accent (#9f24c2) */
  &::before {
    content: "";
    display: block;
    width: 60px;
    height: 5px;
    background: #9f24c2;
    border-radius: 5px;
    margin: 0 auto 1rem auto;
  }

  h2 {
    color: #1a1a2e;
    margin-bottom: 1rem;
  }

  .chart-container {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const AnalyticsView = () => {
  return (
    <DashboardContainer>
      <Title>
        <IoMdAnalytics style={{ marginRight: "10px" }} /> Analytics
      </Title>
      <CardsGrid>
        <Card>
          <h2>Histogram</h2>
          <div className="chart-container">
            <Histogram />
          </div>
        </Card>
        <Card>
          <h2>Pie Chart</h2>
          <div className="chart-container">
            <PieChart />
          </div>
        </Card>
        <Card>
          <h2>Line Chart</h2>
          <div className="chart-container">
            <LineChart />
          </div>
        </Card>
        <Card>
          <h2>Funnel Chart</h2>
          <div className="chart-container">
            <FunnelChart />
          </div>
        </Card>
      </CardsGrid>
    </DashboardContainer>
  );
};

export default AnalyticsView;
