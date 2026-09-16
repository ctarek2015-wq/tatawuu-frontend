import { Link } from "react-router";

const OrganizerDashboard = () => {
  return (
    <main>
      <h1>Organizer dashboard</h1>
      <ul>
        <li><Link to="/organizer/organization">My organization</Link></li>
        <li><Link to="/organizer/campaigns">My campaigns</Link></li>
      </ul>
    </main>
  );
};

export default OrganizerDashboard;
