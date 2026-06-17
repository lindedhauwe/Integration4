import { useState } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { supabase } from "../supabase";
import "./login.css";
import keysImg from "../assets/images/keys.png";
import loginVierkant from "../assets/icons/square-login-top.svg";
import arrowRight from "../assets/icons/arrow-right.svg";
import eyeOpen from "../assets/icons/eyeopen.svg";
import eyeClosed from "../assets/icons/eyeclosed.svg";
import errorIcon from "../assets/icons/error.svg";
import HomeButton from "../components/HomeButton";

export async function clientAction({ request }) {
    const formData = await request.formData();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const errors = {};
    if (!email) errors.email = "Please fill in your email";
    if (!password) errors.password = "Please fill in your password";
    if (Object.keys(errors).length > 0) return { errors };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) return { errors: { server: "Incorrect email or password. Try again." } };

    const user = data.user;
    const name = user.user_metadata?.name || user.email;
    localStorage.setItem("user", JSON.stringify({ uid: user.id, name, email: user.email }));
    return redirect("/account");
}

export default function Login({ actionData }) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [showPassword, setShowPassword] = useState(false);
    const errors = actionData?.errors || {};

    function FieldError({ msg }) {
        if (!msg) return null;
        return (
            <span className="field-error">
                <img src={errorIcon} alt="" className="field-error__icon" />
                {msg}
            </span>
        );
    }

    return (
        <div className="login-page">
            <div className="login-deco">
                <img src={loginVierkant} alt="" className="login-vierkant" />
                <img src={keysImg} alt="" className="login-keys" />
                <HomeButton />
            </div>

            <h1 className="login-title">Log In</h1>

            <main className="login-main">
                <Form method="post" className="login-form">
                    {errors.server && (
                        <span className="field-error field-error--server">
                            <img src={errorIcon} alt="" className="field-error__icon" />
                            {errors.server}
                        </span>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className={`form-input ${errors.email ? "input-error" : ""}`}
                            type="text"
                            name="email"
                        />
                        <FieldError msg={errors.email} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <input
                                className={`form-input ${errors.password ? "input-error" : ""}`}
                                type={showPassword ? "text" : "password"}
                                name="password"
                            />
                            <button
                                type="button"
                                className="toggle-pw"
                                onClick={() => setShowPassword((p) => !p)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword
                                    ? <img src={eyeOpen} alt="Show password" />
                                    : <img src={eyeClosed} alt="Hide password" />
                                }
                            </button>
                        </div>
                        <FieldError msg={errors.password} />
                        <a href="#" className="forgot-pw">Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn-login" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Log In"}
                    </button>
                </Form>

                <Link to="/create-profile" className="signup-link">
                    <img src={arrowRight} alt="" className="signup-arrow" />
                    Don't have an account yet?
                </Link>
            </main>
        </div>
    );
}
