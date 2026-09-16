import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext.js";
import { LanguageContext } from "../../contexts/LanguageContext.js";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const { language, setLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav>
      <Link to="/">{t("Tatawwu’ — Explore")}</Link>{" | "}
      <Link to="/organizations">{t("Organizations")}</Link>{" | "}
      {user ? (
        <>
          {user.role === "Volunteer" && <>
            <Link to="/my/registrations">{t("My activities")}</Link>{" | "}
            <Link to="/my/favorites">{t("Favorites")}</Link>{" | "}
            <Link to="/my/certificates">{t("Certificates")}</Link>{" | "}
          </>}
          {user.role === "Organizer" && <>
            <Link to="/organizer/campaigns">{t("My campaigns")}</Link>{" | "}
            <Link to="/organizer/organization">{t("My organization")}</Link>{" | "}
          </>}
          {user.role === "Admin" && <><Link to="/admin">{t("Moderation")}</Link>{" | "}</>}
          <Link to="/profile">{t("Profile")}</Link>{" | "}
          <button type="button" onClick={handleSignOut}>{t("Sign out")}</button>
        </>
      ) : (
        <><Link to="/sign-in">{t("Sign in")}</Link>{" | "}<Link to="/sign-up">{t("Sign up")}</Link></>
      )}
      {" | "}
      <label>{t("Language")} <select value={language} onChange={(event) => setLanguage(event.target.value)}>
        <option value="en" lang="en">English</option>
        <option value="ar" lang="ar">العربية</option>
      </select></label>
    </nav>
  );
};

export default NavBar;
