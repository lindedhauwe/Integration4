import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import "./editaccount.css";

import arrowRight from "../assets/icons/arrow-right.svg";
import eyeOpen from "../assets/icons/eyeopen.svg";
import eyeClosed from "../assets/icons/eyeclosed.svg";
import rectImg from "../assets/images/rect-editpage.svg";
import editPersonImg from "../assets/images/edit-img.png";

export default function EditAccount() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/login");
            return;
        }
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setUsername(parsed.name || "");
        setEmail(parsed.email || "");
    }, [navigate]);

    async function handleSave(e) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
            setSaving(false);
            localStorage.removeItem("user");
            navigate("/login");
            return;
        }

        const updates = { data: { name: username } };
        if (email !== user.email) updates.email = email;
        if (password) updates.password = password;

        const { data, error: supaError } = await supabase.auth.updateUser(updates);

        setSaving(false);

        if (supaError) {
            setError(supaError.message);
            return;
        }

        const updated = {
            uid: data.user.id,
            name: username,
            email: data.user.email,
        };
        localStorage.setItem("user", JSON.stringify(updated));
        navigate("/account");
    }

    if (!user) return null;

    return (
        <div className="edit-account-page">
            <button className="edit-back-btn" onClick={() => navigate(-1)}>
                <img src={arrowRight} alt="" className="edit-back-btn__icon" />
                Go back
            </button>

            <form className="edit-form" onSubmit={handleSave}>
                <div className="edit-field">
                    <label className="edit-label">Username</label>
                    <input
                        className="edit-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                        required
                    />
                </div>

                <div className="edit-field">
                    <label className="edit-label">Email</label>
                    <input
                        className="edit-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                    />
                </div>

                <div className="edit-field">
                    <label className="edit-label">Password</label>
                    <div className="edit-input-wrapper">
                        <input
                            className="edit-input"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="edit-eye-btn"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <img
                                src={showPassword ? eyeOpen : eyeClosed}
                                alt=""
                                className="edit-eye-icon"
                            />
                        </button>
                    </div>
                </div>

                {error && <p className="edit-error">{error}</p>}

                <button className="edit-save-btn" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <div className="edit-deco">
                <img src={rectImg} alt="" className="edit-deco__rect" />
                <img src={editPersonImg} alt="" className="edit-deco__person" />
            </div>
        </div>
    );
}
