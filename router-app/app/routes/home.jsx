import { useLoaderData } from "react-router";
import { useState } from "react";
import { supabase } from "../supabase";

export async function clientLoader() {
    const { data, error } = await supabase
        .from("recommendations")
        .select("*");

    if (error) throw error;
    return data;
}

export default function Home() {
    const recommendations = useLoaderData();
    const [current, setCurrent] = useState(() => {
        if (!recommendations || recommendations.length === 0) return null;
        return recommendations[Math.floor(Math.random() * recommendations.length)];
    });

    function refresh() {
        if (!recommendations || recommendations.length === 0) return;
        const random = Math.floor(Math.random() * recommendations.length);
        setCurrent(recommendations[random]);
    }

    if (!current) {
        return (
            <main>
                <h1>Home</h1>
                <p>Geen recommendations gevonden.</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Home</h1>

            <div className="post">
                {current.photo_url && (
                    <img
                        src={current.photo_url}
                        alt="Recommendation"
                        style={{ width: "300px", borderRadius: "10px" }}
                    />
                )}

                {current.video_url && (
                    <video
                        src={current.video_url}
                        controls
                        style={{ width: "300px", borderRadius: "10px" }}
                    />
                )}

                <h2>{current.name}</h2>
                <p><strong>City:</strong> {current.city}</p>
                <p>{current.description}</p>

                <p><strong>Vibe:</strong> {current.vibe_tags}</p>
                <p><strong>Type:</strong> {current.type_tags}</p>

                <button onClick={refresh}>Show someone else</button>
            </div>
        </main>
    );
}
