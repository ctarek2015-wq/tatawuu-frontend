import { createContext, useState } from "react";

const UserContext = createContext();
const DataContext = createContext();

const getUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  return JSON.parse(atob(token.split(".")[1]));
};

function ContextProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken());
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const value1 = { user, setUser, loading, setLoading };
  const value2 = { campaigns, setCampaigns, organizations, setOrganizations };
  return (
    <UserContext.Provider value={value1}>
      <DataContext.Provider value={value2}>{children}</DataContext.Provider>
    </UserContext.Provider>
  );
}

export { ContextProvider, UserContext, DataContext };
