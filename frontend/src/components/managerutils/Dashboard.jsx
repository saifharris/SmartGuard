import React, { useState, useEffect } from "react";
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
import axios from "axios";
import ImageUploader from "../ImageUploader";
import SearchByImagePage from "../managerutils/SearchPage";

const DashboardContainer = styled.div`
  display: flex;
  background: #f5f5f5;
  color: #1a1a2e;
  min-height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  h1 {
    font-size: 1.5rem;
    margin: 0;
  }
`;

const Sidebar = styled.aside`
  width: 250px;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const SidebarButton = styled.button`
  background: ${(props) => (props.active ? "#b561d2" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#1a1a2e")};
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.active ? "0 4px 10px rgba(159, 36, 194, 0.5)" : "none")};

  svg {
    margin-right: 8px;
  }

  &:hover {
    background: ${(props) => (props.active ? "#b561d2" : "#f0f0f0")};
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #ffffff;
  overflow: auto;
  box-sizing: border-box;
`;

const AnalyticsViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
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
  flex-wrap: wrap;
`;

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  /* Accent border on top */
  &::before {
    content: "";
    display: block;
    width: 60px;
    height: 5px;
    background: #9f24c2;
    border-radius: 5px;
    margin-bottom: 1rem;
  }

  h1, h2, h3 {
    margin: 0.5rem 0;
    color: #1a1a2e;
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: normal;
  }

  svg {
    display: block;
    margin: 0 auto 0.5rem;
    font-size: 2rem;
    color: #9f24c2;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const Chart = styled.div`
  flex: 1;
  min-width: 250px;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: "";
    display: block;
    width: 60px;
    height: 5px;
    background: #9f24c2;
    border-radius: 5px;
    margin-bottom: 1rem;
  }

  h1, h2 {
    margin: 0.5rem 0;
    color: #1a1a2e;
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
  }

  svg {
    display: block;
    margin: 0 auto 0.5rem;
    font-size: 2rem;
    color: #9f24c2;
  }
`;

const pages = {
  dashboard: (
    <CardsWrapper>
      <CardsContainer>
        <Card>
          <PiSirenFill />
          <h3>Total Theft Detected</h3>
          <h1>9</h1>
        </Card>
        <Card>
          <FaPersonWalking />
          <h3>Daily Visit Count</h3>
          <h1>129</h1>
        </Card>
        <Card>
          <FaSearch />
          <h3>Search By Image</h3>
        </Card>
      </CardsContainer>
      <ChartContainer>
        <Chart>
          <PiSirenFill />
          <h2>Latest Detections</h2>
          <h1>4</h1>
        </Chart>
        <Chart>
          <h2>Logs Generated (Funnel)</h2>
          <FunnelChart />
        </Chart>
      </ChartContainer>
    </CardsWrapper>
  ),
  "Live-Feeds": <ManagerDashboard />,
  "Analytics": (
    <AnalyticsViewContainer>
      <AnalyticsView />
    </AnalyticsViewContainer>
  ),
  "Logs": <Logs />,
  "Search by image": <SearchByImagePage />,
  "Facial Recognition": <ImageUploader />,
  "Logout": <h2>User Pages</h2>,
};

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManagerVideos = async () => {
      try {
        const managerId = localStorage.getItem("userId");
        if (!managerId) {
          console.error("Manager ID not found in localStorage");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/auth/video/manager/${managerId}`
        );
        setUsername(res.data.username);
      } catch (error) {
        console.error("Error fetching manager videos:", error);
      }
    };

    fetchManagerVideos();
  }, []);

  const handleSidebarClick = (page) => {
    if (page === "Logout") {
      navigate("/");
    } else {
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
          >
            {page === "dashboard" && <MdDashboard />}
            {page === "Live-Feeds" && <ImVideoCamera />}
            {page === "Analytics" && <IoMdAnalytics />}
            {page === "Logs" && <IoDocumentsSharp />}
            {page === "Logout" && <RiLogoutBoxFill />}
            {page.replace("-", " ").toUpperCase()}
          </SidebarButton>
        ))}
      </Sidebar>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header>
          <h1>Hi, {username}</h1>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="manager.png"
              alt="User"
              style={{
                borderRadius: "50%",
                marginRight: "1rem",
                width: "40px",
                height: "40px",
                objectFit: "cover",
              }}
            />
          </div>
        </Header>

        <Main>
          {pages[activePage]}
        </Main>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
