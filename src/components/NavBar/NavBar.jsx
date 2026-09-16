import { Link, NavLink, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext.js";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import logo from "../../assets/logo.png";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const { language, setLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);
  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className="navbar">
      {/* --- logo, top-left --- */}
      <Link to="/" className="nav-logo" onClick={close}>
        <h2 className="sec-title">
          <em>Tatawwu&rsquo;</em>
        </h2>
      </Link>

      {/* --- primary links, middle --- */}
      <ul className={`nav-links ${menuOpen ? "is-open" : ""}`}>
        <li>
          <NavLink to="/" end className={linkClass} onClick={close}>
            {t("Explore")}
          </NavLink>
        </li>
        <li>
          <Link
            to="/activities"
            className={location.pathname === "/activities" ? "active" : ""}
          >
            {t("Campaigns")}
          </Link>
        </li>

        <li>
          <NavLink to="/organizations" className={linkClass} onClick={close}>
            {t("Organizations")}
          </NavLink>
        </li>

        {user?.role === "Volunteer" && (
          <>
            <li>
              <NavLink
                to="/my/registrations"
                className={linkClass}
                onClick={close}
              >
                {t("My activities")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/my/favorites" className={linkClass} onClick={close}>
                {t("Favorites")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my/certificates"
                className={linkClass}
                onClick={close}
              >
                {t("Certificates")}
              </NavLink>
            </li>
          </>
        )}

        {user?.role === "Organizer" && (
          <>
            <li>
              <NavLink
                to="/organizer/campaigns"
                className={linkClass}
                onClick={close}
              >
                {t("My campaigns")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/organizer/organization"
                className={linkClass}
                onClick={close}
              >
                {t("My organization")}
              </NavLink>
            </li>
          </>
        )}

        {user?.role === "Admin" && (
          <li>
            <NavLink to="/admin" className={linkClass} onClick={close}>
              {t("Moderation")}
            </NavLink>
          </li>
        )}

        {user && (
          <li>
            <NavLink to="/profile" className={linkClass} onClick={close}>
              {t("Profile")}
            </NavLink>
          </li>
        )}
      </ul>

      {/* --- language switch + auth, top-right --- */}
      <div className="nav-right">
        <div className="lang-switch" role="group" aria-label={t("Language")}>
          <span
            className={`lang-switch-thumb ${language === "ar" ? "pos-ar" : "pos-en"}`}
          />
          <button
            type="button"
            lang="en"
            className={language === "en" ? "is-active" : ""}
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            type="button"
            lang="ar"
            className={language === "ar" ? "is-active" : ""}
            aria-pressed={language === "ar"}
            onClick={() => setLanguage("ar")}
          >
            AR
          </button>
        </div>

        <div className="nav-auth">
          {user ? (
            <button
              type="button"
              className="btn-nav-solid"
              onClick={handleSignOut}
            >
              {t("Sign out")}
            </button>
          ) : (
            <>
              <Link to="/sign-in" className="btn-nav-ghost" onClick={close}>
                {t("Sign in")}
              </Link>
              <Link to="/sign-up" className="btn-nav-solid" onClick={close}>
                {t("Sign up")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="nav-burger"
          aria-label={t("Menu")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
