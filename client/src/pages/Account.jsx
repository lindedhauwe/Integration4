import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Account.css";

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

                <Link to="/account/edit">
                    <button>Edit profile</button>
                </Link>

                <button onClick={handleLogout}>Log out</button>

                
            </main>

            <footer className="account-footer">
                <h2>Contact</h2>
                <p>Questions? Contact us anytime!</p>
                <img src="/src/assets/hand-tel_footer.jpg" alt="Hand met telefoon" className="account-footer__decoration" />
                <a href="mailto:info@antwerp.be">info@antwerp.be</a>
                <a href="tel:+32 03 22 11 333">+32 03 22 11 333</a>
            </footer>
        </div>
    );
}
