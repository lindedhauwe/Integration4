import { useState } from "react";

export default function UserForm({ user, onSave }) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        onSave({
            name,
            email,
            password: password || undefined
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username
                <input
                    type="text"
                    placeholder="e.g. anna_michiels"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                Password (optional)
                <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <button type="submit">Save changes</button>
        </form>
    );
}
