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

const MOCK_BARS = [
    { id: 1, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 2, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 3, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 4, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
    { id: 5, name: "Café Beveren", location: "Vlasmarkt 2, Antwerp" },
];

export default function Account() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("liked");
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
                        onClick={() => setActiveTab("liked")}
                    >
                        Liked bars
                    </button>
                    <button
                        className={`tab ${activeTab === "visited" ? "tab--active" : ""}`}
                        onClick={() => setActiveTab("visited")}
                    >
                        Visited bars
                    </button>
                </div>

                <ul className="bars-list">
                    {MOCK_BARS.map((bar) => (
                        <li className="bar-item" key={bar.id}>
                            <div>
                                <h3 className="bar-name">{bar.name}</h3>
                                <p className="bar-location">
                                    <img src={locationPink} alt="" className="location-icon" />
                                    {bar.location}
                                </p>
                            </div>
                            <Link to={`/bar/${bar.id}`} className="btn-view-spot">
                                View spot ›
                            </Link>
                        </li>
                    ))}
                </ul>

                <a href="#" className="see-more">See 5 more</a>
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
