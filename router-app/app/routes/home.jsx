import { useEffect, useState } from "react";
//import { supabase } from "../supabase";

export default function Home() {
    const [recommendations, setRecommendations] = useState([]);
    const [current, setCurrent] = useState(null);

    // 1. Data ophalen uit Supabase
    useEffect(() => {
        async function fetchData() {
            const { data, error } = await supabase
                .from("recommendations")
                .select("*");

            if (error) {
                console.error(error);
                return;
            }

            setRecommendations(data);

            // Kies meteen een random recommendation
            if (data.length > 0) {
                const random = Math.floor(Math.random() * data.length);
                setCurrent(data[random]);
            }
        }

        fetchData();
    }, []);

    // 2. Refresh knop → nieuwe random recommendation
    function refresh() {
        if (recommendations.length === 0) return;

        const random = Math.floor(Math.random() * recommendations.length);
        setCurrent(recommendations[random]);
    }

    if (!current) {
        return (
            <main>
                <h1>Home</h1>
                <p>Loading recommendations...</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Home</h1>

            <div className="post">
                {/* Foto */}
                {current.photo_url && (
                    <img
                        src={current.photo_url}
                        alt="Recommendation"
                        style={{ width: "300px", borderRadius: "10px" }}
                    />
                )}

                {/* Video */}
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

                {/* Tags */}
                <p><strong>Vibe:</strong> {current.vibe_tags}</p>
                <p><strong>Type:</strong> {current.type_tags}</p>

                <button onClick={refresh}>Show someone else</button>
            </div>
        </main>
    );
}
