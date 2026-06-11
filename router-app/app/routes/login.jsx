import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase";
import "./login.css";
import keysImg from "../assets/keys.png";
import loginVierkant from "../assets/square-login-top.svg";
import arrowRight from "../assets/arrow-right.svg";
import eyeOpen from "../assets/eyeopen.svg";
import eyeClosed from "../assets/eyeclosed.svg";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

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

        localStorage.setItem("user", JSON.stringify(data));
        navigate("/account");
    }

    return (
        <div className="login-page">
            <div className="login-deco">
                <img src={loginVierkant} alt="" className="login-vierkant" />
                <img src={keysImg} alt="" className="login-keys" />
            </div>

            <h1 className="login-title">Log In</h1>

            <main className="login-main">
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Email or Username</label>
                        <input
                            className="form-input"
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <input
                                className="form-input"
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
                        <a href="/forgot-password" className="forgot-pw">Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn-login">Log In</button>
                </form>

                <Link to="/create-profile" className="signup-link">
                    <img src={arrowRight} alt="" className="signup-arrow" />
                    Don't have an account yet?
                </Link>
            </main>
        </div>
    );
}
