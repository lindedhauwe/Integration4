import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        // user zoeken op email OF username
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .or(`email.eq.${identifier},name.eq.${identifier}`)
            .single();

        if (error || !data) {
            alert("User not found");
            return;
        }

        if (data.password !== password) {
            alert("Incorrect password");
            return;
        }

        // user opslaan
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/account");
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

                    <button type="submit">Log in</button>
                </form>

                <Link to="/create-profile" className="auth-link">
                    Don’t have an account yet? →
                </Link>
            </main>
        </>
    );
}
