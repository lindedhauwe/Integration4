import { useState } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { supabase } from "../supabase";
import "./create-profile.css";
import "./login.css";
import typewriterImg from "../assets/images/typewriter.png";
import loginVierkant from "../assets/icons/square-login-top.svg";
import arrowRight from "../assets/icons/arrow-right.svg";
import eyeOpen from "../assets/icons/eyeopen.svg";
import eyeClosed from "../assets/icons/eyeclosed.svg";
import errorIcon from "../assets/icons/error.svg";
import HomeButton from "../components/HomeButton";

export async function clientAction({ request }) {
    const formData = await request.formData();
    const username = String(formData.get("username") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirm") || "");

    const errors = {};
    if (!username) errors.username = "Please fill in a username";
    if (!email) errors.email = "Please fill in your email";
    if (!password) errors.password = "Please fill in a password";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!confirm) errors.confirm = "Please confirm your password";
    else if (confirm !== password) errors.confirm = "Passwords do not match";
    if (Object.keys(errors).length > 0) return { errors };

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: username } },
    });

    if (error) return { errors: { server: "Something went wrong: " + error.message } };

    const user = data.user;
    localStorage.removeItem("liked_cafes");
    localStorage.setItem("user", JSON.stringify({ uid: user.id, name: username, email: user.email }));

    const { data: cafes } = await supabase.from("cafés").select("id, name, adress, gps_lat, gps_lng");
    if (cafes && cafes.length > 0) {
        const shuffled = [...cafes].sort(() => Math.random() - 0.5);
        const randomCafe = shuffled[0];
        localStorage.setItem(`current_cafe_${user.id}`, JSON.stringify({ id: randomCafe.id, name: randomCafe.name, adress: randomCafe.adress, lat: randomCafe.gps_lat, lng: randomCafe.gps_lng }));
        sessionStorage.setItem("current_cafe", JSON.stringify({ id: randomCafe.id, name: randomCafe.name, adress: randomCafe.adress }));
        const visitCount = Math.floor(Math.random() * 4) + 2;
        const visited = shuffled.slice(1, 1 + visitCount).map((c) => ({ id: c.id, name: c.name, adress: c.adress, lat: c.gps_lat, lng: c.gps_lng }));
        localStorage.setItem(`visited_cafes_${user.id}`, JSON.stringify(visited));
    }

    return redirect("/account");
}

export default function CreateProfile({ actionData }) {
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
        <div className="createprofile-page">
            <div className="createprofile-deco">
                <img src={loginVierkant} alt="" className="createprofile-vierkant" />
                <img src={typewriterImg} alt="" className="createprofile-typewriter" />
                <HomeButton />
            </div>

            <h1 className="createprofile-title">Create Profile</h1>

            <main className="createprofile-main">
                <Form method="post" className="createprofile-form">
                    {errors.server && (
                        <span className="field-error field-error--server">
                            <img src={errorIcon} alt="" className="field-error__icon" />
                            {errors.server}
                        </span>
                    )}

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className={`form-input ${errors.username ? "input-error" : ""}`}
                            type="text"
                            name="username"
                            placeholder="e.g anna_michiels"
                        />
                        <FieldError msg={errors.username} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className={`form-input ${errors.email ? "input-error" : ""}`}
                            type="email"
                            name="email"
                            placeholder="e.g anna.michiels@gmail.be"
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
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            className={`form-input ${errors.confirm ? "input-error" : ""}`}
                            type="password"
                            name="confirm"
                        />
                        <FieldError msg={errors.confirm} />
                    </div>

                    <button type="submit" className="btn-createprofile" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Join the community"}
                    </button>
                </Form>

                <Link to="/login" className="login-link">
                    <img src={arrowRight} alt="" className="login-arrow" />
                    Already have an account?
                </Link>
            </main>
        </div>
    );
}
