import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase";

export default function CreateProfile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirm) {
            alert("Passwords do not match");
            return;
        }

        const { data, error } = await supabase
            .from("users")
            .insert([{ name: username, email, password }])
            .select()
            .single();

        if (error) {
            alert("Er ging iets mis: " + error.message);
            return;
        }

        // user opslaan zodat Account.jsx weet wie is ingelogd
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/account");
    }

    return (
        <>
            <header>
                <h1>Create Profile</h1>
            </header>

            <main className="auth-page">
                <form onSubmit={handleSubmit}>
                    <label>
                        Username
                        <input
                            type="text"
                            placeholder="e.g. anna_michiels"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            placeholder="e.g. anna.michiels@gmail.be"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <label>
                        Confirm password
                        <input
                            type="password"
                            placeholder="********"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </label>

                    <button type="submit">Join the community</button>
                </form>

                <Link to="/login" className="auth-link">
                    I already have an account →
                </Link>
            </main>
        </>
    );
}
