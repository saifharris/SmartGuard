import React, { useState } from "react";
import styled from "styled-components";
import { MdDashboard } from "react-icons/md";
import { ImVideoCamera } from "react-icons/im";
import { IoMdAnalytics } from "react-icons/io";
import { IoDocumentsSharp } from "react-icons/io5";
import { RiLogoutBoxFill } from "react-icons/ri";
import ManagerDashboard from "../ManagerDashboard";
import AnalyticsView from "./AnalyticsView";
import { useNavigate } from "react-router-dom";
import { PiSirenFill } from "react-icons/pi";
import { FaPersonWalking } from "react-icons/fa6";
import Logs from "../supermanagerutils/Logs";
import FunnelChart from "../adminutils/Funnel";
import { FaSearch } from "react-icons/fa";
import { useEffect } from "react";
import axios from "axios";
const DashboardContainer = styled.div`
  display: flex;
  background-color: #f5f5f5;
  color: #1a1a2e;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.aside`
  width: 250px;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const SidebarButton = styled.button`
  background: ${(props) => (props.active ? "#b561d2" : "#eaeaea")};
  color: ${(props) => (props.active ? "white" : "#1a1a2e")};
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.active ? "0 4px 10px rgba(159, 36, 194, 0.5)" : "none")};

  &:hover {
    background: ${(props) => (!props.active ? "#d9d9d9" : null)};
  }
`;

// const Main = styled.main`
//   flex: 1;
//   padding: 2rem;
//   position: relative;
//   background: linear-gradient(145deg, #f5f5f5, #f0f0f0);
// `;
const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0; /* Remove default padding */
  position: relative;
  background: linear-gradient(145deg, #f5f5f5, #f0f0f0);
  overflow: hidden; /* Prevent overflow */
  height: 100%;
  width: calc(100% - 250px); /* Adjust for sidebar */
  box-sizing: border-box;
`;


const AnalyticsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden; /* Prevent any scrolling issues */
  padding: 0; /* Remove padding to align perfectly */
  box-sizing: border-box;
`;



const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top right, #9f24c2 50%, #ffffff 50%);
  z-index: -1;
`;

const CardsWrapper = styled.div`
  position: relative;
  background: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  flex: 1;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  h2 {
    margin: 0;
  }
  p {
    margin: 0.5rem 0 0;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

const Chart = styled.div`
  flex: 1;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;


const pages = {
  dashboard: (
    <CardsWrapper>
      <CardsContainer>
        <Card>
          <h2><PiSirenFill /></h2>
          <h3>Total Theft Detected</h3>
          <h1>9</h1>
        </Card>
        <Card>
          <h2><FaPersonWalking/></h2>
          <h3>Daily Visit Count</h3>
          <h1>129</h1>
        </Card>
        <Card>
         <h1><FaSearch/></h1>
         <h1>Search By Image</h1>
         
        </Card>
      </CardsContainer>
      <ChartContainer>
        <Chart>
          <PiSirenFill size={30}/>
          <h2>Latest Detections</h2>
          <h1>4</h1>
        </Chart>
        <Chart>
          <FunnelChart/>
        </Chart>
      </ChartContainer>
    </CardsWrapper>
  ),
  "Live-Feeds": <ManagerDashboard/>,
  "Analytics": <AnalyticsViewContainer>
     <AnalyticsView/>
  </AnalyticsViewContainer>
 ,
  'Logs':<h1></h1>,
 
  "Logout": <h2>User Pages</h2>,
};

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // React Router navigate function

  useEffect(() => {
    const fetchManagerVideos = async () => {
      try {
        const managerId = localStorage.getItem("userId"); // Get manager ID from localStorage
        if (!managerId) {
          console.error("Manager ID not found in localStorage");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/auth/video/manager/${managerId}`
        );
        
        setUsername(res.data.username); // Set username

       
      } catch (error) {
        console.error("Error fetching manager videos:", error);
       
      }
    };

    console.log(username)
    fetchManagerVideos();
  }, []);

  const handleSidebarClick = (page) => {
    if (page === "Logs") {
      navigate("/logs"); // Navigate to the Logs route
    } 
    else if(page==="Logout"){
        navigate("/")
    }
    else {
      setActivePage(page);
    }
  };

  return (
    <DashboardContainer>
      <Sidebar>
  {Object.keys(pages).map((page) => (
    <SidebarButton
      key={page}
      active={activePage === page}
      onClick={() => handleSidebarClick(page)}
      //onClick={() => setActivePage(page)}
    >
      {page === "dashboard" && <MdDashboard style={{ marginRight: "8px" }} />}
      {page === "Live-Feeds" && <ImVideoCamera style={{ marginRight: "8px" }} />}
      {page === "Analytics" && <IoMdAnalytics  style={{ marginRight: "8px" }} />}
      {page === "Logs" && <IoDocumentsSharp   style={{ marginRight: "8px" }} />}
      {page === "Logout" && <RiLogoutBoxFill   style={{ marginRight: "8px" }} />}
      {page.replace("-", " ").toUpperCase()}
    </SidebarButton>
  ))}
</Sidebar>

      <div style={{ flex: 1 }}>
      <Header>
  <h1>Hi, {username}</h1>
  <div style={{ display: "flex", alignItems: "center" }}>
    <img
      src="manager.png"
      alt="User"
      style={{
        borderRadius: "50%",
        marginRight: "1rem",
        width: "40px", // Set a fixed width
        height: "40px", // Set a fixed height
        objectFit: "cover", // Ensures the image fits the container properly
      }}
    />
    
  </div>
</Header>

        <Main>
          <BackgroundWrapper />
          {pages[activePage]}
        </Main>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
