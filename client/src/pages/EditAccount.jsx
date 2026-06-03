import UserForm from "../components/UserForm";
import { Link } from "react-router-dom";

export default function EditAccount() {
    return (
        <>
            <header>
                <h1>Edit profile</h1>
                <Link to="/account">Go back</Link>
            </header>

            <main className="account-page">
                <UserForm />

                <h2>Contact</h2>
                <p>Questions? Contact us anytime!</p>
                <a href="mailto:info@antwerp.be">info@antwerp.be</a>
                <a href="tel:+32 03 22 11 333">+32 03 22 11 333</a>
            </main>
        </>
    );
}
