import { useEffect, useState } from "react";
import { UserContext } from "./UserContext.js";
import * as authService from "../services/authService.js";


function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setAccountError("");
      try {
        if (localStorage.getItem("token")) {
          setUser(await authService.me());
        }
      } catch (error) {
        if (error.status === 401 || error.status === 404) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setAccountError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [attempt]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, accountError, retry: () => setAttempt(attempt + 1) }}>
      {children}
    </UserContext.Provider>
  );
}

export { ContextProvider };
