import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext.js";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav>
      <Link to="/">Tatawwu’ — Explore</Link>{" | "}
      <Link to="/organizations">Organizations</Link>{" | "}
      {user ? (
        <>
          {user.role === "Volunteer" && <>
            <Link to="/my/registrations">My activities</Link>{" | "}
            <Link to="/my/favorites">Favorites</Link>{" | "}
            <Link to="/my/certificates">Certificates</Link>{" | "}
          </>}
          {user.role === "Organizer" && <>
            <Link to="/organizer/campaigns">My campaigns</Link>{" | "}
            <Link to="/organizer/organization">My organization</Link>{" | "}
          </>}
          {user.role === "Admin" && <><Link to="/admin">Moderation</Link>{" | "}</>}
          <Link to="/profile">Profile</Link>{" | "}
          <button type="button" onClick={handleSignOut}>Sign out</button>
        </>
      ) : (
        <><Link to="/sign-in">Sign in</Link>{" | "}<Link to="/sign-up">Sign up</Link></>
      )}
    </nav>
  );
};

export default NavBar;
