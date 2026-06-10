import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Account.css";

import editIcon from "../assets/edit.svg";
import phoneIcon from "../assets/phone.svg";
import mailIcon from "../assets/mail.svg";
import leaveIcon from "../assets/leave.svg";

export default function Account() {
    const [user, setUser] = useState(null);
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
        <div className="account-container">
            <header>
                {/* <h1>Account</h1> */}
                <Link className="back_to_recommedations" to="/recommendations">Go back to recommendations</Link>
            </header>

            <main className="account-page">
                <h1 className="account-title">{user.name}</h1>
                <p className="account-email">{user.email}</p>

                <a href="/edit" className="edit-link">
                    <img src={editIcon} alt="edit icon" className="icon" />
                    Edit account
                </a>


                <a href="/leave" className="leave-link" onClick={handleLogout}>
                    <img src={leaveIcon} alt="leave icon" className="icon" />
                    Leave account
                </a>

                
            </main>

            <footer className="account-footer">
                <h2>Contact</h2>
                <p>Questions? Contact us anytime!</p>
                <img src="/src/assets/hand-tel_footer.jpg" alt="Hand met telefoon" className="account-footer__decoration" />
                <div className="contact-mail">
                    <a href="mailto:info@antwerp.be" className="mail-link">
                        <img src={mailIcon} alt="mail icon" className="icon" />
                    </a>
                </div>

                <div className="contact-phone">
                    <a href="tel:+32 03 22 11 333" className="phone-link">
                        <img src={phoneIcon} alt="phone icon" className="icon" />
                    </a>
                </div>
            </footer>
        </div>
    );
}
