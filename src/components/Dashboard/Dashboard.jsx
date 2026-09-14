import { useContext, useEffect } from "react";
import { currentUser } from "../../services/userService";

import { UserContext } from "../../contexts/UserContext";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const signedInUser = await currentUser();
        console.log(signedInUser);
      } catch (err) {
        console.log(err);
      }
    };
    getCurrentUser();
  }, [user]);

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
