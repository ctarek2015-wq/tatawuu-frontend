import { useContext, useEffect } from "react";
import { UserContext, DataContext } from "./contexts/UserContext.jsx";
import { Routes, Route } from "react-router";

//services
import { index, create, update, remove } from "./services/campaignService.js";
import * as organizationService from "./services/organizationService.js";

import AdminDashboard from "./pages/private/admin/dashboard/AdminDashboard.jsx";
import OrganizerDashboard from "./pages/private/Organizer/dashboard/OrganizerDashboard.jsx";
import VolunteerDashboard from "./pages/private/volunteer/dashboard/VolunteerDashboard.jsx";
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
  const { campaigns, setCampaigns, organizations, setOrganizations } =
    useContext(DataContext);
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
    const fetchOrganization = async () => {
      setLoading(true);
      try {
        const data = await organizationService.index();
        setOrganizations(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
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
    setOrganizations([newOrganization, ...organizations]);
  };
  const handleUpdateOrganization = async (id, formData) => {
    const updatedOrganization = await update(id, formData);
    setOrganizations(
      organizations.map((o) => (o.id === id ? updatedOrganization : o)),
    );
  };
  const handleRemoveOrganization = async (id) => {
    await remove(id);
    setOrganizations(organizations.filter((o) => o.id !== id));
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route
          path="/"
          element={<OrganizationList organizations={organizations} />}
        />
        {user && user.role === "Admin" && (
          <Route path="/admin" element={<AdminDashboard />} />
        )}
        {user && user.role === "Organizer" && (
          <Route path="/organizer" element={<OrganizerDashboard />} />
        )}
        {user && user.role === "Volunteer" && (
          <Route path={`/${user.username}`} element={<VolunteerDashboard />} />
        )}
      </Routes>
      {loading && <p>Loading campaigns...</p>}
    </>
  );
}

export default App;
