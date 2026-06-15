import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase";
import "./createprofile.css";
import "./login.css";
import typewriterImg from "../assets/typewriter.png";
import loginVierkant from "../assets/square-login-top.svg";
import arrowRight from "../assets/arrow-right.svg";
import eyeOpen from "../assets/eyeopen.svg";
import eyeClosed from "../assets/eyeclosed.svg";
import errorIcon from "../assets/icons/error.svg";

export default function CreateProfile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();

    const errors = submitted ? {
        username: !username.trim() ? "Please fill in a username" : null,
        email: !email.trim() ? "Please fill in your email" : null,
        password: !password.trim() ? "Please fill in a password" : password.length < 8 ? "Password must be at least 8 characters" : null,
        confirm: !confirm.trim() ? "Please confirm your password" : confirm !== password ? "Passwords do not match" : null,
    } : {};

    function FieldError({ msg }) {
        if (!msg) return null;
        return (
            <span className="field-error">
                <img src={errorIcon} alt="" className="field-error__icon" />
                {msg}
            </span>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        setServerError(null);

        if (!username.trim() || !email.trim() || !password.trim() || !confirm.trim()) return;
        if (password.length < 8) return;
        if (password !== confirm) return;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name: username } },
        });

        if (error) {
            setServerError("Er ging iets mis: " + error.message);
            return;
        }

        const user = data.user;
        localStorage.removeItem("liked_cafes");
        localStorage.removeItem("visited_cafes");
        localStorage.removeItem("current_cafe");
        sessionStorage.removeItem("current_cafe");
        localStorage.setItem("user", JSON.stringify({ uid: user.id, name: username, email: user.email }));

        const { data: cafes } = await supabase.from("cafés").select("id, name, adress, gps_lat, gps_lng");
        if (cafes && cafes.length > 0) {
            const shuffled = [...cafes].sort(() => Math.random() - 0.5);

            const randomCafe = shuffled[0];
            localStorage.setItem("current_cafe", JSON.stringify({ id: randomCafe.id, name: randomCafe.name, adress: randomCafe.adress, lat: randomCafe.gps_lat, lng: randomCafe.gps_lng }));
            sessionStorage.setItem("current_cafe", JSON.stringify({ id: randomCafe.id, name: randomCafe.name, adress: randomCafe.adress }));

            const visitCount = Math.floor(Math.random() * 6);
            const visited = shuffled.slice(1, 1 + visitCount).map((c) => ({ id: c.id, name: c.name, adress: c.adress, lat: c.gps_lat, lng: c.gps_lng }));
            localStorage.setItem("visited_cafes", JSON.stringify(visited));
        }

        navigate("/account");
    }

    return (
        <div className="createprofile-page">
            <div className="createprofile-deco">
                <img src={loginVierkant} alt="" className="createprofile-vierkant" />
                <img src={typewriterImg} alt="" className="createprofile-typewriter" />
                <button className="login-back" onClick={() => navigate(-1)}>
                    <img src={arrowRight} alt="" className="login-back__icon" />
                    Go back
                </button>
            </div>

            <h1 className="createprofile-title">Create Profile</h1>

            <main className="createprofile-main">
                <form onSubmit={handleSubmit} className="createprofile-form">
                    {serverError && (
                        <span className="field-error field-error--server">
                            <img src={errorIcon} alt="" className="field-error__icon" />
                            {serverError}
                        </span>
                    )}

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className={`form-input ${errors.username ? "input-error" : ""}`}
                            type="text"
                            placeholder="e.g anna_michiels"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FieldError msg={errors.username} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className={`form-input ${errors.email ? "input-error" : ""}`}
                            type="email"
                            placeholder="e.g anna.michiels@gmail.be"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FieldError msg={errors.email} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Password
                            <span className="form-label__hint">(Minimum 8 characters)</span>
                        </label>
                        <div className="input-wrapper">
                            <input
                                className={`form-input ${errors.password ? "input-error" : ""}`}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="toggle-pw"
                                onClick={() => setShowPassword((p) => !p)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <img src={eyeOpen} alt="Show password" />
                                ) : (
                                    <img src={eyeClosed} alt="Hide password" />
                                )}
                            </button>
                        </div>
                        <FieldError msg={errors.password} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            className={`form-input ${errors.confirm ? "input-error" : ""}`}
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                        <FieldError msg={errors.confirm} />
                    </div>

                    <button type="submit" className="btn-createprofile">Join the community</button>
                </form>

                <Link to="/login" className="login-link">
                    <img src={arrowRight} alt="" className="login-arrow" />
                    Already have an account?
                </Link>
            </main>
        </div>
    );
}
