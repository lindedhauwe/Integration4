import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import hamburger from "~/assets/icons/hamburgermenu.svg";
import hamburgerBeige from "~/assets/icons/hamburgermenu-beige.svg";
import bgNav from "~/assets/icons/bg-nav.svg";
import bgNavOrange from "~/assets/icons/bg-nav-orange.svg";
import closeIcon from "~/assets/icons/close-orange.svg";
import playIcon from "~/assets/icons/play-icon.svg";
import lockIcon from "~/assets/icons/lock.svg";
import lockOpenIcon from "~/assets/icons/lockopen.svg";
import lockedNavBg from "~/assets/icons/locked-nav.svg";
import "./Nav.css";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [isRecLocked, setIsRecLocked] = useState(false);
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
              className={({ isActive }) => `nav-cell nav-cell--recommendation${isActive ? " nav-cell--active" : ""}${isRecLocked ? " nav-cell--locked" : ""}`}
              onClick={(e) => { if (isRecLocked) { e.preventDefault(); return; } setOpen(false); }}
            >
              {isRecLocked && <img src={lockedNavBg} alt="" className="nav-cell__locked-bg" />}
              <div className="nav-cell__rec-header">
                <span className="nav-cell__title">Write a<br />Recommendation</span>
                <button
                  className="nav-cell__lock-btn"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsRecLocked((v) => !v); }}
                >
                  <img src={isRecLocked ? lockIcon : lockOpenIcon} alt="" />
                </button>
              </div>
              <span className="nav-cell__subtitle">
                {isRecLocked
                  ? "You can unlock this feature once you're in Antwerp. See you there!"
                  : "Pass on your Antwerp bar story"}
              </span>
            </NavLink>
          </div>

          <NavLink to="/storytelling" className="nav-footer-link" onClick={() => setOpen(false)}>
            <img src={playIcon} alt="" className="play-icon" />
            <span className="nav-footer-link-text">
              Rewatch info / Story of Antwerp
            </span>
          </NavLink>
        </div>
      )}
    </>
  );
}
