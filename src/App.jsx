import { useContext } from "react";
import { Link, Navigate, Route, Routes } from "react-router";
import { UserContext } from "./contexts/UserContext.js";
import { LanguageContext } from "./contexts/LanguageContext.js";
import NavBar from "./components/NavBar/NavBar.jsx";
import ExplorePage from "./components/ExplorePage/ExplorePage.jsx";
import CampaignDetail from "./components/Campain/CampaignDetail.jsx";
import OrganizationList from "./pages/public/Organization/OrganizationList.jsx";
import OrganizationDetail from "./pages/public/Organization/OrganizationDetail.jsx";
import SignInForm from "./pages/public/SignInForm/SignInForm.jsx";
import SignUpForm from "./pages/public/SignUpForm/SignUpForm.jsx";
import Profile from "./pages/private/Profile/Profile.jsx";
import OrganizerDashboard from "./pages/private/Organizer/dashboard/OrganizerDashboard.jsx";
import OrganizationProfile from "./pages/private/Organizer/dashboard/OrganizationProfile.jsx";
import CampaignManager from "./pages/private/campaign/dashboard/CampaignManager.jsx";
import CampaignForm from "./pages/private/campaign/dashboard/CampaignForm.jsx";
import CampaignParticipants from "./pages/private/campaign/dashboard/CampaignParticipants.jsx";
import AdminDashboard from "./pages/private/admin/dashboard/AdminDashboard.jsx";
import VolunteerDashboard from "./pages/private/volunteer/dashboard/VolunteerDashboard.jsx";
import Favorites from "./pages/private/volunteer/dashboard/Favorites.jsx";
import Certificates from "./pages/private/volunteer/dashboard/Certificates.jsx";
import CampaignsPage from "./components/CampaignsPage/CampaignsPage.jsx";
import "./App.css";

function App() {
  const { user, loading, accountError, retry } = useContext(UserContext);
  const { t, tError } = useContext(LanguageContext);
  if (loading)
    return (
      <>
        <NavBar />
        <p>{t("Loading account...")}</p>
      </>
    );
  if (accountError)
    return (
      <>
        <NavBar />
        <main>
          <p role="alert">
            {t("Could not load your account")}: {tError(accountError)}
          </p>
          <button type="button" onClick={retry}>
            {t("Retry")}
          </button>
        </main>
      </>
    );

  const accountPage = (page, role) => {
    if (!user) return <Navigate to="/sign-in" replace />;
    if (role && user.role !== role)
      return <p>{t("This page is for {role} accounts.", { role: t(role) })}</p>;
    return page;
  };

  const signInPage =
    user?.role === "Organizer"
      ? "/organizer/campaigns"
      : user?.role === "Admin"
        ? "/admin"
        : "/";
  const signUpPage =
    user?.role === "Organizer" ? "/organizer/organization" : "/";

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/campaigns" element={<ExplorePage />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/organizations" element={<OrganizationList />} />
        <Route path="/organizations/:id" element={<OrganizationDetail />} />
        <Route path="/activities" element={<CampaignsPage />} />
        <Route
          path="/organizations/:orgId/campaigns"
          element={<ExplorePage />}
        />
        <Route
          path="/sign-in"
          element={user ? <Navigate to={signInPage} replace /> : <SignInForm />}
        />
        <Route
          path="/sign-up"
          element={user ? <Navigate to={signUpPage} replace /> : <SignUpForm />}
        />
        <Route path="/profile" element={accountPage(<Profile />)} />
        <Route
          path="/organizer"
          element={accountPage(<OrganizerDashboard />, "Organizer")}
        />
        <Route
          path="/organizer/organization"
          element={accountPage(<OrganizationProfile />, "Organizer")}
        />
        <Route
          path="/organizer/campaigns"
          element={accountPage(<CampaignManager />, "Organizer")}
        />
        <Route
          path="/organizer/campaigns/new"
          element={accountPage(<CampaignForm key="new" />, "Organizer")}
        />
        <Route
          path="/organizer/campaigns/:id/edit"
          element={accountPage(<CampaignForm key="edit" />, "Organizer")}
        />
        <Route
          path="/organizer/campaigns/:id/participants"
          element={accountPage(<CampaignParticipants />, "Organizer")}
        />
        <Route
          path="/my/registrations"
          element={accountPage(<VolunteerDashboard />, "Volunteer")}
        />
        <Route
          path="/my/favorites"
          element={accountPage(<Favorites />, "Volunteer")}
        />
        <Route
          path="/my/certificates"
          element={accountPage(<Certificates />, "Volunteer")}
        />
        <Route
          path="/admin"
          element={accountPage(<AdminDashboard />, "Admin")}
        />
        <Route
          path="*"
          element={
            <main>
              <h1>{t("Page not found")}</h1>
              <Link to="/">{t("Explore activities")}</Link>
            </main>
          }
        />
      </Routes>
    </>
  );
}

export default App;
