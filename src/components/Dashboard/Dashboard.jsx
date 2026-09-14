import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import AdminDashboard from "../../pages/private/admin/dashboard/AdminDashboard.jsx";
import OrganizerDashboard from "../../pages/private/Organizer/dashboard/OrganizerDashboard.jsx";
import VolunteerDashboard from "../../pages/private/volunteer/VolunteerDashboard/VolunteerDashboard.jsx";
const Dashboard = () => {
  const { user } = useContext(UserContext);

  if (user.role === "Organizer") {
    return <OrganizerDashboard />;
  }

  if (user.role === "Admin") {
    return <AdminDashboard />;
  }
  if (user.role === "Volunteer") {
    return <VolunteerDashboard />;
  }

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        This is the dashboard page where you can see a list of all the users.
      </p>
    </main>
  );
};

export default Dashboard;
