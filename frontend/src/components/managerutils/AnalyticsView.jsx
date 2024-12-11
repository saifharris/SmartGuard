import React from "react";
import styled from "styled-components";
import Histogram from "../adminutils/Histogram";
import PieChart from "../adminutils/PieChart";
import LineChart from "../adminutils/LineChart";
import FunnelChart from "../adminutils/Funnel";
import { IoMdAnalytics } from "react-icons/io";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
  background: #f5f5f5;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  font-size: 36px;
  color: #1a1a2e;
  font-weight: bold;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: auto;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex; 
  flex-direction: column; 
  justify-content: flex-start;
  color: #333;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  }

  /* Optional top border accent */
  border-top: 5px solid
    ${(props) =>
      props.variant === "prioritized" ? "#9f24c2" : "#b561d2"};
`;

const CardTitle = styled.h2`
  margin: 0 0 10px 0;
  font-size: 22px;
  color: #1a1a2e;
  font-weight: bold;
  text-align: center;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex; 
  align-items: center; 
  justify-content: center;
`;

const AnalyticsView = () => {
  return (
    <DashboardContainer>
      <Title>
        <IoMdAnalytics size={50} style={{ marginRight: "10px" }} /> Analytics
      </Title>
      <CardsGrid>
        <Card variant="prioritized">
          <CardTitle>Manager Distribution</CardTitle>
          <CardContent>
            <Histogram />
          </CardContent>
        </Card>

        <Card variant="additional">
          <CardTitle>Role Overview</CardTitle>
          <CardContent>
            <PieChart />
          </CardContent>
        </Card>

        <Card variant="prioritized">
          <CardTitle>Shoplifting Trends</CardTitle>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>

        <Card variant="additional">
          <CardTitle>Log Generation</CardTitle>
          <CardContent>
            <FunnelChart />
          </CardContent>
        </Card>
        
        {/* Add more cards as needed */}
      </CardsGrid>
    </DashboardContainer>
  );
};

export default AnalyticsView;
