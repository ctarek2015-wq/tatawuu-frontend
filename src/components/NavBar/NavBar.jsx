import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav>
      {user ? (
        <ul>
          <li>Welcome, {user.username}</li>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/campaigns">Campaigns</Link>
          </li>
          <li>
            <Link to="/organizations">Organizations</Link>
          </li>
          <li>
            <Link to="/" onClick={handleSignout}>
              Sign Out
            </Link>
          </li>
          {user.role === "Admin" && (
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
          )}
          {user.role === "Organizer" && (
            <li>
              <Link to="/organizer">Organizer Dashboard</Link>
            </li>
          )}
          {user.role === "Volunteer" && (
            <li>
              <Link to={`/${user.username}`}>{user.username} Dashboard</Link>
            </li>
          )}
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
