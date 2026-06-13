import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import hamburger from "~/assets/hamburgermenu.svg";
import hamburgerBeige from "~/assets/hamburgermenu-beige.svg";
import bgNav from "~/assets/bg-nav.svg";
import bgNavOrange from "~/assets/bg-nav-orange.svg";
import closeIcon from "~/assets/close.svg";
import playIcon from "~/assets/play-icon.svg";
import "./Nav.css";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isLoggedIn = (() => { try { return !!localStorage.getItem('user'); } catch { return false; } })();
  const hamburgerBg = pathname === "/" ? bgNavOrange : bgNav;
  const hamburgerIcon = pathname === "/" ? hamburgerBeige : hamburger;

  return (
    <>
      <header className="nav-header">
        <button className="hamburger-btn" onClick={() => setOpen(true)} aria-label="open menu">
          <img src={hamburgerBg} alt="" className="hamburger-bg" />
          <img src={hamburgerIcon} alt="" className="hamburger-icon" />
        </button>
      </header>

      {open && (
        <div className="menu-overlay">
          <button className="close-btn" onClick={() => setOpen(false)}>
            <img src={bgNav} alt="" className="close-bg" />
            <img src={closeIcon} alt="sluit menu" className="close-icon" />
          </button>

          <div className="nav-main">
            <div className="nav-row--top">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-cell nav-cell--home${isActive ? " nav-cell--active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="nav-cell__title nav-cell__title--home">Home</span>
                <span className="nav-cell__subtitle">A personal <br />Antwerp bar recommendation</span>
              </NavLink>

              <div className="nav-col">
                <NavLink
                  to="/map"
                  className={({ isActive }) => `nav-cell nav-cell--pubcrawl${isActive ? " nav-cell--active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-cell__title">Pub Crawl</span>
                  <span className="nav-cell__subtitle">Your personal <br /> bar journey</span>
                </NavLink>
                <NavLink
                  to={isLoggedIn ? "/account" : "/login"}
                  className={({ isActive }) => `nav-cell nav-cell--account${isActive ? " nav-cell--active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-cell__title">My Account</span>
                  <span className="nav-cell__subtitle">{isLoggedIn ? "View your account" : "Log in to your account"}</span>
                </NavLink>
              </div>
            </div>

            <NavLink
              to="/recommendations"
              className={({ isActive }) => `nav-cell nav-cell--recommendation${isActive ? " nav-cell--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="nav-cell__title">Write a<br />Recommendation</span>
              <span className="nav-cell__subtitle">Pass on your Antwerp bar story</span>
            </NavLink>
          </div>

          <NavLink to="#" className="nav-footer-link" onClick={() => setOpen(false)}>
            <img src={playIcon} alt="" className="play-icon" />
            <span>Rewatch info / Story of Antwerp</span>
          </NavLink>
        </div>
      )}
    </>
  );
}
