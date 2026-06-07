import { useState } from "react";
import { Link } from "react-router-dom";
import hamburger from "../assets/hamburgermenu.svg";
import "./Nav.css";

export default function Nav() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className="nav-header">
                <img
                    src={hamburger}
                    alt="menu"
                    className="hamburger-icon"
                    onClick={() => setOpen(true)}
                />
            </header>

            {open && (
                <div className="menu-overlay">
                    <button className="close-btn" onClick={() => setOpen(false)}>
                        ✕
                    </button>

                    <nav className="menu-links">
                        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                        <Link to="/recommendations" onClick={() => setOpen(false)}>Recommendation</Link>
                        <Link to="/thespot" onClick={() => setOpen(false)}>The Spot</Link>
                        <Link to="/map" onClick={() => setOpen(false)}>Map</Link>
                        <Link to="/login" onClick={() => setOpen(false)}>Account</Link>
                        <Link to="/otherbar" onClick={() => setOpen(false)}>Other Bar</Link>
                        <Link to="/beerloading" onClick={() => setOpen(false)}>Beer loading</Link>
                    </nav>
                </div>
            )}
        </>
    );
}
