import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import "./account.css";

import footerHandImg from "../assets/hand-tel_footer.jpg";
import editIcon from "../assets/edit.svg";
import phoneIcon from "../assets/phone.svg";
import mailIcon from "../assets/mail.svg";
import leaveIcon from "../assets/leave.svg";
import keysImg from "../assets/keys.png";
import beigeVierkant from "../assets/beige-vierkant.svg";
import locationPink from "../assets/location-pink.svg";
import fullHeartPink from "../assets/full-heart-pink.svg";
import emptyHeartPink from "../assets/empty-heart-pink.svg";
import arrowRight from "../assets/arrow-right.svg";

const VISITED_BARS = [
    { id: 1, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 2, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 3, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 4, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 5, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 6, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 7, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 8, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 9, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 10, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
];

const LIKED_BARS = [
    { id: 1, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 2, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 3, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 4, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 5, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 6, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 7, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 8, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 9, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
    { id: 10, name: "Café t'Hoeksen", location: "Vlasmarkt 2, Antwerp" },
];

export default function Account() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("liked");
    const [visibleCount, setVisibleCount] = useState(5);
    const [likedIds, setLikedIds] = useState(() => new Set(LIKED_BARS.map((b) => b.id)));

    function switchTab(tab) {
        setActiveTab(tab);
        setVisibleCount(5);
    }

    function toggleLike(id) {
        setLikedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(stored));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    if (!user) return null;

    function handleLogout() {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="account-page">
            <section className="account-hero">
                <img src={beigeVierkant} alt="" className="deco-vierkant deco-vierkant--top" />
                <img src={keysImg} alt="" className="deco-keys" />
                <h1 className="account-username">{user.name}</h1>
                <p className="account-email">{user.email}</p>

                <div className="account-actions">
                    <a href="/edit" className="btn-edit">
                        <img src={editIcon} alt="" className="btn-icon" />
                        Edit Profile
                    </a>
                    <button className="btn-logout" onClick={handleLogout}>
                        <img src={leaveIcon} alt="" className="btn-icon" />
                        Log Out
                    </button>
                </div>
            </section>

            <section className="account-bars">
                <div className="bars-tabs">
                    <button
                        className={`tab ${activeTab === "liked" ? "tab--active" : ""}`}
                        onClick={() => switchTab("liked")}
                    >
                        Liked bars
                    </button>
                    <button
                        className={`tab ${activeTab === "visited" ? "tab--active" : ""}`}
                        onClick={() => switchTab("visited")}
                    >
                        Visited bars
                    </button>
                </div>

                <ul className="bars-list">
                    {(activeTab === "liked" ? LIKED_BARS : VISITED_BARS).slice(0, visibleCount).map((bar) => (
                        <li className="bar-item" key={bar.id}>
                            <div>
                                <h3 className="bar-name">{bar.name}</h3>
                                <p className="bar-location">
                                    <img src={locationPink} alt="" className="location-icon" />
                                    {bar.location}
                                </p>
                            </div>
                            {activeTab === "liked" ? (
                                <div className="bar-actions">
                                    <img
                                        src={likedIds.has(bar.id) ? fullHeartPink : emptyHeartPink}
                                        alt="liked"
                                        className="heart-icon"
                                        onClick={() => toggleLike(bar.id)}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <Link to={`/bar/${bar.id}`} className="btn-arrow">
                                        <img src={arrowRight} alt="" className="arrow-icon" />
                                    </Link>
                                </div>
                            ) : (
                                <Link to={`/bar/${bar.id}`} className="btn-view-spot">
                                    View spot <img src={arrowRight} alt="" className="arrow-icon" />
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="bars-pagination">
                    {visibleCount > 5 && (
                        <button className="see-less" onClick={() => setVisibleCount(5)}>
                            See less
                        </button>
                    )}
                    <button
                        className="see-more"
                        onClick={() => setVisibleCount((c) => c + 5)}
                        disabled={visibleCount >= (activeTab === "liked" ? LIKED_BARS : VISITED_BARS).length}
                    >
                        See 5 more
                    </button>
                </div>
            </section>

            <footer className="account-footer">
                <div className="footer-content">
                    <h2>Questions?</h2>
                    <p>Contact us anytime</p>
                    <div className="footer-contact">
                        <a href="mailto:info@antwerp.be" className="btn-contact">
                            <img src={mailIcon} alt="mail" />
                        </a>
                        <a href="tel:+3203221333" className="btn-contact">
                            <img src={phoneIcon} alt="phone" />
                        </a>
                    </div>
                </div>
                <img src={footerHandImg} alt="" className="footer-hand" />
                <img src={beigeVierkant} alt="" className="deco-vierkant deco-vierkant--bottom" />
            </footer>
        </div>
    );
}
