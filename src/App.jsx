import { useState, useContext, useEffect } from "react";
import { UserContext } from "./contexts/UserContext.jsx";
import { Routes, Route } from "react-router";

//services
import { index, create, update, remove } from "./services/campaignService.js";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import * as organizationService from "./services/organizationService.js";

//components
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Landing from "./components/Landing/Landing.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./pages/public/SignUpForm/SignUpForm.jsx";
import SignInForm from "./pages/public/SignInForm/SignInForm.jsx";
import OrganizationList from "./pages/public/Organization/OrganizationList.jsx";
// styles
import "./App.css";

function App() {
  const { user, loading, setLoading } = useContext(UserContext);
  const [campaigns, setCampaigns] = useState([]);
  const [organizations, setOrganization] = useState([]);
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const data = await index();
        setCampaigns(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);
  useEffect(() => {
    const fetchOraganization = async () => {
      setLoading(true);
      try {
        const data = await organizationService.index();
        setOrganization(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOraganization();
  }, []);

  // handlers for campaigns

  const handleAddCampaign = async (formData) => {
    const newCampaign = await create(formData);
    setCampaigns([newCampaign, ...campaigns]);
  };

  const handleUpdateCampaign = async (id, formData) => {
    const updatedCampaign = await update(id, formData);
    setCampaigns(campaigns.map((c) => (c.id === id ? updatedCampaign : c)));
  };

  const handleRemoveCampaign = async (id) => {
    await remove(id);
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };
  //handlers for organization
  const handleAddOrganization = async (formData) => {
    const newOrganization = await create(formData);
    setOrganization([newOrganization, ...organizations]);
  };
  const handleUpdateOrganization = async (id, formData) => {
    const updatedOrganization = await update(id, formData);
    setOrganization(
      Organization.map((o) => (o.id === id ? updatedOrganization : o)),
    );
  };
  const handleRemoveOrganization = async (id) => {
    await remove(id);
    setOrganization(organizations.filter((o) => o.id !== id));
  };
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route
          path="/organizations"
          element={<OrganizationList organizations={organizations} />}
        />
        {user.role === "admin" && (
          <Route path="/admin" element={<AdminDashboard />} />
        )}
      </Routes>
      {loading && <p>Loading campaigns...</p>}
    </>
  );
}

export default App;
