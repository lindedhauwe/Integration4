import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";
import supabase from "../supabase";

export default function EditAccount() {
    const navigate = useNavigate();

    async function handleSave(updatedUser) {
        const { error } = await supabase
            .from("users")
            .update(updatedUser)
            .eq("uid", "HUIDIGE_USER_ID");

        if (!error) navigate("/account");
    }

    return (
        <main>
            <h1>Edit profile</h1>
            <UserForm user={/* user data */} onSave={handleSave} />
        </main>
    );
}
