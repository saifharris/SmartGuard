import React from "react";
import styled from "styled-components";
import Histogram from "../adminutils/Histogram";
import PieChart from "../adminutils/PieChart";
import LineChart from "../adminutils/LineChart";
import FunnelChart from "../adminutils/Funnel";
import { IoMdAnalytics } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";

// // CSS for AnalyticsView
// const DashboardContainer = styled.div`
//   width: 100%;
//   height: 100%;
//   overflow-x: hidden; // Prevent horizontal overflow
// `;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden; /* Prevent horizontal overflow */
  padding: 0; /* Remove any unnecessary padding */
  box-sizing: border-box;
`;

const CardsSlider = styled.div`
  display: flex;
  
  gap: 20px;
  padding: 20px;
  overflow-x: auto; /* Allow horizontal scrolling for cards */
  scroll-behavior: smooth;
  width: 100%;
  box-sizing: border-box; /* Prevent width-related issues */
`;




const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  font-size: 36px;
  color: #333;
  font-weight: bold;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(145deg, #5fe8ff, #e6f9ff);
  color: #333;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(145deg, #ff5f7e, #ffe1e6);
    color: white;
  }

  svg {
    margin-right: 10px;
  }
`;

// const CardsSlider = styled.div`
//   display: flex;
//   overflow-x: auto;
//   scroll-behavior: smooth;
//   gap: 20px;
//   padding: 20px;
// `;

const Card = styled.div`
  min-width: 300px;
  height: 400px;
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
  const goBack = () => {
    window.history.back();
  };

  return (
    <DashboardContainer>
      {/* <BackButton onClick={goBack}>
        <IoMdArrowBack size={20} /> Back
      </BackButton> */}
      <Title>
        <IoMdAnalytics size={50} style={{ marginRight: "10px" }} /> Analytics
      </Title>
      <CardsSlider>
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
      </CardsSlider>
    </DashboardContainer>
  );
};

export default AnalyticsView;