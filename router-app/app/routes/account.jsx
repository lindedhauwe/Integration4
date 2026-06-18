import { Form, Link, redirect } from "react-router";
import { useState } from "react";
import { supabase } from "../supabase";

import "./account.css";
import HomeButton from "../components/HomeButton";

import footerHandImg from "../assets/images/handphone.png";
import editIcon from "../assets/icons/edit.svg";
import mailIcon from "../assets/icons/mail.svg";
import leaveIcon from "../assets/icons/leave.svg";
import keysImg from "../assets/images/keys.png";
import beigeVierkantTop from "../assets/icons/square-account-top.svg";
import beigeVierkantBottom from "../assets/icons/square-account-bottom.svg";

import locationPink from "../assets/icons/location-pink.svg";
import fullHeartPink from "../assets/icons/full-heart-pink.svg";
import arrowRight from "../assets/icons/arrow-right-root.svg";
import antwerpLogo from "../assets/images/Antwerpen.svg.png";

function getVisitedBars() {
    try {
        const userId = JSON.parse(localStorage.getItem("user") || "{}").uid || "anon";
        const visited = JSON.parse(localStorage.getItem(`visited_cafes_${userId}`) || "[]");
        const current = JSON.parse(localStorage.getItem(`current_cafe_${userId}`) || "null");
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

export function clientLoader() {
    const stored = localStorage.getItem("user");
    if (!stored) return redirect("/login");
    return {
        user: JSON.parse(stored),
        visitedBars: getVisitedBars(),
        likedBars: getLikedBarsFromStorage(),
    };
}
clientLoader.hydrate = true;

export async function clientAction() {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    return redirect("/login");
}

export default function Account({ loaderData }) {
    const { user, visitedBars, likedBars: initialLikedBars } = loaderData;
    const [activeTab, setActiveTab] = useState("liked");
    const [visibleCount, setVisibleCount] = useState(5);
    const [likedBars, setLikedBars] = useState(initialLikedBars);

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

    return (
        <div className="account-page">
            <section className="account-hero">
                <HomeButton />
                <img src={beigeVierkantTop} alt="" className="deco-vierkant deco-vierkant--top" />
                <img src={keysImg} alt="" className="deco-keys" />
                <h1 className="account-username">{user.name}</h1>
                <p className="account-email">{user.email}</p>

                <div className="account-actions">
                    <Link to="/account/edit" className="btn-edit">
                        <img src={editIcon} alt="" className="btn-icon" />
                        Edit Profile
                    </Link>
                    <Form method="post">
                        <button type="submit" className="btn-logout">
                            <img src={leaveIcon} alt="" className="btn-icon" />
                            Log Out
                        </button>
                    </Form>
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
                        <a href="https://www.antwerpen.be" target="_blank" rel="noopener noreferrer" className="btn-contact btn-contact--antwerp">
                            <img src={antwerpLogo} alt="Stad Antwerpen" />
                        </a>
                    </div>
                </div>
                <img src={footerHandImg} alt="" className="footer-hand" />
                <img src={beigeVierkantBottom} alt="" className="deco-vierkant deco-vierkant--bottom" />
            </footer>
        </div>
    );
}
