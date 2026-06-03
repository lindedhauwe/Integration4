// src/pages/Account.jsx
import UserForm from '../components/UserForm';
import { Link } from 'react-router-dom';

export default function Account() {
    return (
        <main className="account-page">
            <h1>Account</h1>

            <UserForm />

            <h2>Contact</h2>
            <p>Questions? Contact us anytime!</p>
            <Link to="mailto:info@antwerp.be">info@antwerp.be</Link>
            <Link to="tel:+32 03 22 11 333">+32 03 22 11 333</Link>
        </main>
    );
}
