import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Loader from "./utils/Loader.jsx"; // Import your custom Loader component
import { MdDashboard } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";
import { BsFilePersonFill } from "react-icons/bs";
import { TbLogout } from "react-icons/tb";
import Smanagers from "./adminutils/Smanagers.jsx";
import Managers from "./adminutils/managers.jsx";
import Histogram from "./adminutils/Histogram.jsx";
import PieChart from "./adminutils/PieChart.jsx";
import LineChart from "./adminutils/LineChart.jsx";
import FunnelChart from "./adminutils/Funnel.jsx";


const GradientBox = styled.div`
  background: linear-gradient(145deg, #ff5f7e, #ffe1e6); /* Pinkish gradient */
  border-radius: 30px;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2); /* Shadow for depth */
`;
const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  background: #f4f4f4; /* Neutral background for the entire section */
`;



// Styled Components
const AdminPanelContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(145deg, #9f24c2, #361e8b);
`;

const Sidebar = styled.div`
  width: 250px;
  background: #2c0f44;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: white;
`;

const SidebarButton = styled.button`
  width: 100%;
  background: #361e8b;
  color: #fff;
  padding: 15px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #9f24c2;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  width: 100%;
  background: #9f24c2;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #d368f5;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

const ContentArea = styled.div`
  flex-grow: 1;
  padding: 20px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
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

  .card-title {
    font-size: 20px;
    color: ${(props) =>
      props.variant === "prioritized" ? "#ff5f7e" : "#5fe8ff"};
    font-weight: 500;
    margin-bottom: 10px;
  }

  .card-percentage {
    font-size: 36px;
    font-weight: bold;
    color: #333;
  }
`;

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Form = styled.form`
  background: #ffffff; /* White background */
  border-radius: 20px;
  padding: 40px 50px;
  width: 100%;
  max-width: 400px; /* Restrict form width */
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  text-align: center;
`;


const Input = styled.input`
  width: 91%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 2px solid #ddd; /* Light border for subtlety */
  border-radius: 8px;
  background-color: #f7f7f7; /* Light grey background for inputs */
  color: #333; /* Dark text for readability */
  font-size: 16px;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff5f7e; /* Match pinkish gradient on focus */
    background-color: #ffffff; /* White background on focus */
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 15px;
  background: #ff5f7e; /* Pink button to match background */
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #ff7990; /* Slightly lighter pink on hover */
    transform: scale(1.05);
  }
`;

// Main Component
const AdminPanel = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);

  const [counts, setCounts] = useState({ supermanagers: 0, managers: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/counts");
        setCounts(res.data); // Set the counts for supermanagers and managers
      } catch (error) {
        console.error("Error fetching counts:", error);
        alert("Failed to fetch counts. Please try again.");
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer
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

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (currentView === "dashboard") {
      return (
        <DashboardContainer>
          <div>
            <MdDashboard size={30} />{" "}
            <span style={{ fontSize: "33px" }}>Dashboard</span>
          </div>
          <CardsGrid>
            <Card variant="prioritized">
            <span>
      <img src="/super.png" alt="" style={{ width: "120px", height: "120px" }} />
    </span>
              <div className="card-title"><span style={{ fontWeight: 900, fontSize: "20px", color: "#232b2b" }}>
        No of Supermanagers
      </span></div>
              <div className="card-percentage">{counts.supermanagers}</div>
              

            </Card>
            <Card variant="additional">
            <span>
      <img src="/manager.png" alt="" style={{ width: "120px", height: "120px" }} />
    </span>
              <div className="card-title">
              <span style={{ fontWeight: 900, fontSize: "20px", color: "#232b2b" }}>
        No of Managers
      </span>
              </div>
              <div className="card-percentage">{counts.managers}</div>
              <span></span>
            </Card>
            <Card variant="prioritized">
            <span>
      <img src="/store.png" alt="" style={{ width: "120px", height: "120px" }} />
    </span>
              <div className="card-title"><span style={{ fontWeight: 900, fontSize: "20px", color: "#232b2b" }}>
        No of Stores
      </span></div>
              <div className="card-percentage">{counts.supermanagers}</div>
              
            </Card>
            <Card variant="additional">
            <span>
      <img src="/reports.png" alt="" style={{ width: "120px", height: "120px" }} />
    </span>
              <div className="card-title"><span style={{ fontWeight: 900, fontSize: "20px", color: "#232b2b" }}>
        No of Reports
      </span></div>
              <div className="card-percentage">3</div>
              
            </Card>
          </CardsGrid>
        </DashboardContainer>
      );
    }

    // if (currentView === "addSuperManager") {
    //   return (
    //     <DashboardContainer>
    //       <h2>Add SuperManager</h2>
    //       <Form onSubmit={handleCreateSuperManager}>
    //         <Input
    //           type="text"
    //           placeholder="SuperManager Username"
    //           value={formData.username}
    //           onChange={(e) =>
    //             setFormData({ ...formData, username: e.target.value })
    //           }
    //         />
    //         <Input
    //           type="password"
    //           placeholder="SuperManager Password"
    //           value={formData.password}
    //           onChange={(e) =>
    //             setFormData({ ...formData, password: e.target.value })
    //           }
    //         />
    //         <Button type="submit">Create SuperManager</Button>
    //       </Form>
    //     </DashboardContainer>
    //   );
    // }

    if (currentView === "addSuperManager") {
        return (
            <> <div>
            <RiAddCircleFill size={30} />{" "}
            <span style={{ fontSize: "33px" }}>Add Supermanager</span>
          </div>
          <CenterWrapper>
            <GradientBox>
              <Form onSubmit={handleCreateSuperManager}>
                <h2 style={{ color: "#333", marginBottom: "20px" }}>Add SuperManager</h2>
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
                <Button type="submit">Create SuperManager</Button>
              </Form>
            </GradientBox>
          </CenterWrapper>
          </>
         
        );
      }
      if(currentView === "getsupermanagers"){
        return(

            <Smanagers/>
           
        );
      }

      if (currentView === "getmanagers") {
        return(
            <Managers/>
        )

      }
      if (currentView === "getanalytics"){
        return(
            <DashboardContainer>
          <div>
          <IoMdAnalytics size={50} />
           {" "}
            <span style={{ fontSize: "49px" }}>Analytics</span>
          </div>
          <CardsGrid>
            <Card variant="prioritized">
            <Histogram/>
              

            </Card>
            <Card variant="additional">
           <PieChart/>
            </Card>
            <Card variant="prioritized">
            <LineChart/>
              
            </Card>
            <Card variant="additional">
           <FunnelChart/>
              
            </Card>
          </CardsGrid>
        </DashboardContainer>
        )

      }
      

    return <h2>Other Page Content</h2>;
  };

  return (
    <AdminPanelContainer>
      <Sidebar>
        <SidebarButton onClick={() => setCurrentView("dashboard")}>
          <MdDashboardCustomize /> Dashboard
        </SidebarButton>
        <SidebarButton onClick={() => setCurrentView("addSuperManager")}>
          <RiAddCircleFill /> Add SuperManager
        </SidebarButton>
        <SidebarButton onClick={() => setCurrentView("getsupermanagers")}>
          {" "}
          <BsFilePersonFill /> SuperManagers
        </SidebarButton>
        <SidebarButton onClick={() => setCurrentView("getmanagers")}>
          <BsFilePersonFill /> Managers
        </SidebarButton>
        <SidebarButton onClick={() => setCurrentView("getanalytics")}>
          <IoMdAnalytics /> Analytics
        </SidebarButton>
        <LogoutButton onClick={() => (window.location.href = "/")}>
          {" "}
          <TbLogout size={35} />{" "}
        </LogoutButton>
      </Sidebar>
      <ContentArea>{renderContent()}</ContentArea>
    </AdminPanelContainer>
  );
};

export default AdminPanel;
