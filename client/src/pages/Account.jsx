import { Link } from "react-router-dom";

export default function Account() {
    return (
        <>
            <header>
                <h1>Account</h1>
                <Link to="/recommendations">Go back to recommendations</Link>
            </header>

            <main className="account-page">
                <h1>[Name db]</h1>
                <p>Email: [Email db]</p>

                <Link to="/account/edit">
                    <button>Edit profile</button>
                </Link>

               <Link to="/login">
                    <button>Log out</button>
                </Link>

                <h2>Contact</h2>
                <p>Questions? Contact us anytime!</p>
                <a href="mailto:info@antwerp.be">info@antwerp.be</a>
                <a href="tel:+32 03 22 11 333">+32 03 22 11 333</a>
            </main>
        </>
    );
}
