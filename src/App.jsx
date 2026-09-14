import { useState, useContext, useEffect } from "react";
import { UserContext } from "./contexts/UserContext.jsx";
import { Routes, Route } from "react-router";
import { index, create, update, remove } from "./services/campaignService.js";
import * as organizationService from "./services/organizationService";

//components
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Landing from "./components/Landing/Landing.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./pages/public/SignUpForm/SignUpForm.jsx";
import SignInForm from "./pages/public/SignInForm/SignInForm.jsx";
// styles
import "./App.css";

function App() {
  const { user, loading, setLoading } = useContext(UserContext);
  const [campaigns, setCampaigns] = useState([]);
  const [organization, setorganization] = useState([]);
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

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
      </Routes>
      {loading && <p>Loading campaigns...</p>}
    </>
  );
}

export default App;
