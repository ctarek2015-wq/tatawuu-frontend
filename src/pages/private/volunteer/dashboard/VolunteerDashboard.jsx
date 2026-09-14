import { useContext } from "react";
import { UserContext } from "../../../../contexts/UserContext.jsx";

const VolunteerDashboard = () => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <h1>{user.username} Dashboard</h1>
    </div>
  );
};

export default VolunteerDashboard;
