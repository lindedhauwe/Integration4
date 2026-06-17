import { useState } from "react";
import { Form, redirect, useNavigation } from "react-router";
import { supabase } from "../supabase";
import "./account_.edit.css";

import arrowRight from "../assets/icons/arrow-right.svg";
import eyeOpen from "../assets/icons/eyeopen.svg";
import eyeClosed from "../assets/icons/eyeclosed.svg";
import rectImg from "../assets/images/rect-editpage.svg";
import editPersonImg from "../assets/images/edit-img.png";

export async function clientAction({ request }) {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return redirect("/login");

    const formData = await request.formData();
    const username = String(formData.get("username") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const updates = { data: { name: username } };
    const currentEmail = sessionData.session.user.email;
    if (email && email !== currentEmail) updates.email = email;
    if (password) updates.password = password;

    const { data, error } = await supabase.auth.updateUser(updates);

    if (error) return { error: error.message };

    const stored = localStorage.getItem("user");
    const existing = stored ? JSON.parse(stored) : {};
    localStorage.setItem("user", JSON.stringify({
        ...existing,
        name: username,
        email: data.user.email,
    }));

    return redirect("/account");
}

export default function EditAccount({ actionData }) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [showPassword, setShowPassword] = useState(false);

    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = stored ? JSON.parse(stored) : {};

    return (
        <div className="edit-account-page">
            <button className="edit-back-btn" onClick={() => history.back()}>
                <img src={arrowRight} alt="" className="edit-back-btn__icon" />
                Go back
            </button>

            <Form method="post" className="edit-form">
                <div className="edit-field">
                    <label className="edit-label">Username</label>
                    <input
                        className="edit-input"
                        type="text"
                        name="username"
                        defaultValue={user.name || ""}
                        placeholder="Your username"
                        required
                    />
                </div>

                <div className="edit-field">
                    <label className="edit-label">Email</label>
                    <input
                        className="edit-input"
                        type="email"
                        name="email"
                        defaultValue={user.email || ""}
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
                            name="password"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="edit-eye-btn"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <img src={showPassword ? eyeOpen : eyeClosed} alt="" className="edit-eye-icon" />
                        </button>
                    </div>
                </div>

                {actionData?.error && <p className="edit-error">{actionData.error}</p>}

                <button className="edit-save-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </Form>

            <div className="edit-deco">
                <img src={rectImg} alt="" className="edit-deco__rect" />
                <img src={editPersonImg} alt="" className="edit-deco__person" />
            </div>
        </div>
    );
}
