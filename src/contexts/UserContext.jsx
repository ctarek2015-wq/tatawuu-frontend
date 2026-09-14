import { createContext, useState } from "react";

const UserContext = createContext();

const getUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  return JSON.parse(atob(token.split(".")[1]));
};

function UserProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken());
  const [loading, setLoading] = useState(false);

  const value = { user, setUser, loading, setLoading };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserProvider, UserContext };
