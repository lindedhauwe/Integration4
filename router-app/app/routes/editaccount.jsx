import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
//import { supabase } from "../supabase";

export default function EditAccount() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("user");

        if (!stored) {
            navigate("/login");
            return;
        }

        const parsed = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(parsed);
        setName(parsed.name);
        setEmail(parsed.email);
    }, [navigate]);

    async function handleSave(e) {
        e.preventDefault();

        const { data, error } = await supabase
            .from("users")
            .update({ name, email })
            .eq("uid", user.uid)
            .select()
            .single();

        if (error) {
            alert("Er ging iets mis: " + error.message);
            return;
        }

        // update localStorage zodat Account.jsx de nieuwe data toont
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/account");
    }

    if (!user) return null;

    return (
        <>
            <header>
                <h1>Edit profile</h1>
                <Link to="/account">Go back</Link>
            </header>

            <main className="account-page">
                <form onSubmit={handleSave}>
                    <label>
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <button type="submit">Save changes</button>
                </form>
            </main>
        </>
    );
}
