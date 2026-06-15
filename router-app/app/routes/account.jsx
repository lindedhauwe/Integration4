import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import "./account.css";

import footerHandImg from "../assets/handphone.png";
import editIcon from "../assets/edit.svg";
import phoneIcon from "../assets/phone.svg";
import mailIcon from "../assets/mail.svg";
import leaveIcon from "../assets/leave.svg";
import keysImg from "../assets/keys.png";
import beigeVierkantTop from "../assets/square-account-top.svg";
import beigeVierkantBottom from "../assets/square-account-bottom.svg";

import locationPink from "../assets/location-pink.svg";
import fullHeartPink from "../assets/full-heart-pink.svg";
import arrowRight from "../assets/arrow-right.svg";

function getVisitedBars() {
    try {
        const visited = JSON.parse(localStorage.getItem("visited_cafes") || "[]");
        const current = JSON.parse(localStorage.getItem("current_cafe") || "null");
        const all = [...visited];
        if (current && !all.find((v) => String(v.id) === String(current.id))) {
            all.unshift(current);
        }
        return all;
    } catch { return []; }
}

function getLikedBarsFromStorage() {
    try { return JSON.parse(localStorage.getItem("liked_cafes") || "[]"); }
    catch { return []; }
}

export default function Account() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("liked");
    const [visibleCount, setVisibleCount] = useState(5);
    const [visitedBars, setVisitedBars] = useState([]);
    const [likedBars, setLikedBars] = useState([]);

    function switchTab(tab) {
        setActiveTab(tab);
        setVisibleCount(5);
    }

    function toggleLike(cafeId) {
        const liked = getLikedBarsFromStorage();
        const updated = liked.filter((c) => String(c.cafe_id) !== String(cafeId));
        localStorage.setItem("liked_cafes", JSON.stringify(updated));
        setLikedBars(updated);
    }
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            navigate("/login");
            return;
        }
        setVisitedBars(getVisitedBars());
        setLikedBars(getLikedBarsFromStorage());
    }, [navigate]);

    if (!user) return null;

    async function handleLogout() {
        await supabase.auth.signOut();
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="account-page">
            <section className="account-hero">
                <img src={beigeVierkantTop} alt="" className="deco-vierkant deco-vierkant--top" />
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
                    {(activeTab === "liked" ? likedBars : visitedBars).slice(0, visibleCount).map((bar) => {
                        const barId = bar.cafe_id ?? bar.id;
                        return (
                            <li className="bar-item" key={barId}>
                                <div>
                                    <h3 className="bar-name">{bar.name}</h3>
                                    {bar.adress && (
                                        <p className="bar-location">
                                            <img src={locationPink} alt="" className="location-icon" />
                                            {bar.adress}
                                        </p>
                                    )}
                                </div>
                                {activeTab === "liked" ? (
                                    <div className="bar-actions">
                                        <img
                                            src={fullHeartPink}
                                            alt="liked"
                                            className="heart-icon"
                                            onClick={() => toggleLike(barId)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <Link to={`/thespot?cafe_id=${barId}`} className="btn-arrow">
                                            <img src={arrowRight} alt="" className="arrow-icon" />
                                        </Link>
                                    </div>
                                ) : (
                                    <Link to={`/thespot?cafe_id=${barId}`} className="btn-view-spot">
                                        View spot <img src={arrowRight} alt="" className="arrow-icon" />
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                    {(activeTab === "liked" ? likedBars : visitedBars).length === 0 && (
                        <li className="bar-item bar-item--empty">
                            <p>{activeTab === "liked" ? "No liked bars yet." : "No visited bars yet."}</p>
                        </li>
                    )}
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
                        disabled={visibleCount >= (activeTab === "liked" ? likedBars : visitedBars).length}
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
                            <span>info@antwerp.be</span>
                        </a>
                    </div>
                </div>
                <img src={footerHandImg} alt="" className="footer-hand" />
                <img src={beigeVierkantBottom} alt="" className="deco-vierkant deco-vierkant--bottom" />
            </footer>
        </div>
    );
}
