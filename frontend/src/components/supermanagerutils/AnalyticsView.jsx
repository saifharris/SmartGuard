import React from "react";
import styled from "styled-components";
import Histogram from "../adminutils/Histogram";
import PieChart from "../adminutils/PieChart";
import LineChart from "../adminutils/LineChart";
import FunnelChart from "../adminutils/Funnel";
import { IoMdAnalytics } from "react-icons/io";

// CSS for AnalyticsView
const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  height: calc(100vh - 40px); // Adjust height to fit within available space
  padding: 20px;
`;

const Card = styled.div`
  background: ${(props) =>
    props.variant === "prioritized"
      ? "linear-gradient(145deg, #ff5f7e, #ffe1e6)"
      : "linear-gradient(145deg, #5fe8ff, #e6f9ff)"};
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  transition: transform 0.2s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
  }
`;

const AnalyticsView = () => {
  return (
    <DashboardContainer>
      <div>
        <IoMdAnalytics size={50} />
        <span style={{ fontSize: "49px" }}>Analytics</span>
      </div>
      <CardsGrid>
        <Card variant="prioritized">
          <Histogram />
        </Card>
        <Card variant="additional">
          <PieChart />
        </Card>
        <Card variant="prioritized">
          <LineChart />
        </Card>
        <Card variant="additional">
          <FunnelChart />
        </Card>
      </CardsGrid>
    </DashboardContainer>
  );
};

export default AnalyticsView;
