import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
    const [identifier, setIdentifier] = useState(""); // email or username
    const [password, setPassword] = useState("");

    function handleLogin(e) {
        e.preventDefault();

        console.log("Logging in:", { identifier, password });
        // hier komt later je login API call
    }

    return (
        <>
            <header>
                <h1>Log in</h1>
            </header>

            <main className="auth-page">
                <form onSubmit={handleLogin}>
                    <label>
                        Email or Username
                        <input
                            type="text"
                            placeholder="e.g. anna_michiels"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <Link to="/forgot-password" className="auth-link small">
                        Forget password?
                    </Link>

                    <Link to="/account" className="auth-link small">
                        Log in
                    </Link>
                </form>

                <Link to="/create-profile" className="auth-link">
                    Don’t have an account yet? →
                </Link>
            </main>
        </>
    );
}
