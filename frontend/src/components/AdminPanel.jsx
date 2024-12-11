import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Loader from "./utils/Loader.jsx"; 
import { MdDashboard } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";
import { BsFilePersonFill } from "react-icons/bs";
import { TbLogout } from "react-icons/tb";
import Smanagers from "./adminutils/Smanagers.jsx";
import Managers from "./adminutils/Managers.jsx";
import Histogram from "./adminutils/Histogram.jsx";
import PieChart from "./adminutils/PieChart.jsx";
import LineChart from "./adminutils/LineChart.jsx";
import FunnelChart from "./adminutils/Funnel.jsx";

// ---- Styled components consistent with the "Dashboard" theme ----

// Container that holds the entire page
const DashboardContainer = styled.div`
  display: flex;
  background: #f5f5f5;
  color: #1a1a2e;
  min-height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
`;

// Sidebar container
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

// Buttons in the sidebar
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
  box-shadow: ${(props) =>
    props.active ? "0 4px 10px rgba(159, 36, 194, 0.5)" : "none"};

  svg {
    margin-right: 8px;
  }

  &:hover {
    background: ${(props) => (props.active ? "#b561d2" : "#f0f0f0")};
  }

  &:focus {
    outline: none;
  }
`;

// Main area (content area) on the right side
const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #ffffff;
  overflow: auto;
  box-sizing: border-box;
  position: relative;
`;

// A wrapper for pages that involve cards/charts
const PageWrapper = styled.div`
  position: relative;
  background: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

// Cards container
const CardsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

// Single card styling
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

  img {
    display: block;
    margin: 0 auto;
  }
`;

// Charts container
const ChartContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

// Chart card
const ChartCard = styled.div`
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

// Form Wrapper for adding supermanagers
const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

// Form
const Form = styled.form`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  padding: 2rem;
  max-width: 400px;
  width: 100%;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #1a1a2e;
  }
`;

// Inputs in form
const Input = styled.input`
  width: 100%;
  padding: 5px;
  margin-bottom: 15px;
  border: 2px solid #b561d2;
  border-radius: 8px;
  background-color: #ffffff;
  color: #1a1a2e;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #9f24c2;
    background-color: #f9f9ff;
  }
`;

// Buttons for form
const FormButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #9f24c2;
    box-shadow: 0px 8px 20px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

// ---- Pages Object ----
const AdminPanel = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({ supermanagers: 0, managers: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/counts");
        setCounts(res.data);
      } catch (error) {
        console.error("Error fetching counts:", error);
        alert("Failed to fetch counts. Please try again.");
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateSuperManager = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/create-supermanager", formData);
      alert("SuperManager created successfully!");
      setFormData({ username: "", password: "" });
    } catch (error) {
      console.error("Error creating supermanager:", error);
      alert("Failed to create SuperManager.");
    }
  };

  // Define pages similar to the provided Dashboard code
  const pages = {
    dashboard: (
      <PageWrapper>
        <CardsContainer>
          <Card>
            <img src="/super.png" alt="" style={{ width: "80px", height: "80px" }} />
            <h3>No of SuperManagers</h3>
            <h1>{counts.supermanagers}</h1>
          </Card>
          <Card>
            <img src="/manager.png" alt="" style={{ width: "80px", height: "80px" }} />
            <h3>No of Managers</h3>
            <h1>{counts.managers}</h1>
          </Card>
          <Card>
            <img src="/store.png" alt="" style={{ width: "80px", height: "80px" }} />
            <h3>No of Stores</h3>
            {/* Assuming "stores" can be derived or counted, for now using supermanagers count as placeholder */}
            <h1>{counts.supermanagers}</h1>
          </Card>
          <Card>
            <img src="/reports.png" alt="" style={{ width: "80px", height: "80px" }} />
            <h3>No of Reports</h3>
            <h1>3</h1>
          </Card>
        </CardsContainer>
      </PageWrapper>
    ),
    addSuperManager: (
      <>
        <FormWrapper>
          <Form onSubmit={handleCreateSuperManager}>
            <h2>Add SuperManager</h2>
            <Input
              type="text"
              placeholder="SuperManager Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="SuperManager Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <FormButton type="submit">Create SuperManager</FormButton>
          </Form>
        </FormWrapper>
      </>
    ),
    getsupermanagers: <Smanagers />,
    getmanagers: <Managers />,
    getanalytics: (
      <PageWrapper>
        <CardsContainer>
          <Card>
            <Histogram />
          </Card>
          <Card>
            <PieChart />
          </Card>
          <Card>
            <LineChart />
          </Card>
          <Card>
            <FunnelChart />
          </Card>
        </CardsContainer>
      </PageWrapper>
    ),
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarButton
          active={activePage === "dashboard"}
          onClick={() => setActivePage("dashboard")}
        >
          <MdDashboardCustomize />
          Dashboard
        </SidebarButton>
        <SidebarButton
          active={activePage === "addSuperManager"}
          onClick={() => setActivePage("addSuperManager")}
        >
          <RiAddCircleFill />
          Add SuperManager
        </SidebarButton>
        <SidebarButton
          active={activePage === "getsupermanagers"}
          onClick={() => setActivePage("getsupermanagers")}
        >
          <BsFilePersonFill />
          SuperManagers
        </SidebarButton>
        <SidebarButton
          active={activePage === "getmanagers"}
          onClick={() => setActivePage("getmanagers")}
        >
          <BsFilePersonFill />
          Managers
        </SidebarButton>
        <SidebarButton
          active={activePage === "getanalytics"}
          onClick={() => setActivePage("getanalytics")}
        >
          <IoMdAnalytics />
          Analytics
        </SidebarButton>
        <SidebarButton onClick={() => (window.location.href = "/")}>
          <TbLogout />
          Logout
        </SidebarButton>
      </Sidebar>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header>
          <h1>Admin Panel</h1>
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

        <Main>{pages[activePage]}</Main>
      </div>
    </DashboardContainer>
  );
};

export default AdminPanel;
