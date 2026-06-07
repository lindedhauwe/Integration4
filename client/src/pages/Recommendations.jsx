import { useState } from "react";
import PhotoDropzone from "../components/PhotoDropzone";
import { supabase } from "../supabase";

export default function Recommendations() {
    const [uploadedMedia, setUploadedMedia] = useState([]);
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");
    const [vibe, setVibe] = useState([]);
    const [type, setType] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();

        const { data, error } = await supabase
            .from("recommendations")
            .insert({
                name,
                city,
                description,
                vibe_tags: vibe,
                type_tags: type,
                photo_url: uploadedMedia[0] || null,
                video_url: null,
                user_id: null,   // 👈 belangrijk nu
                café_id: null,   // of ["café_id"]: null als je nog de é gebruikt
            });

        if (error) {
            console.error("Supabase insert error:", error);
            alert("Er ging iets mis bij het opslaan");
            return;
        }

        alert("Recommendation saved!");
        console.log("Saved!", data);
    }

    return (
        <div>
            <h1>Recommendations</h1>
            <h2>Capture the moment</h2>

            <form onSubmit={handleSubmit}>
                <p>Share the vibe</p>

                <PhotoDropzone onUpload={setUploadedMedia} />

                <label>Your name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label>Your city</label>
                <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <label>Your recommendation</label>
                <textarea
                    required
                    maxLength={200}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label>Vibe tags</label>
                <select
                    multiple
                    required
                    onChange={(e) =>
                        setVibe([...e.target.selectedOptions].map((o) => o.value))
                    }
                >
                    <option value="authentic">Authentic</option>
                    <option value="cozy">Cozy</option>
                    <option value="hidden-gem">Hidden gem</option>
                    <option value="local-favorite">Local favorite</option>
                    <option value="late-night">Late night</option>
                    <option value="lively">Lively</option>
                    <option value="chill">Chill</option>
                    <option value="artsy">Artsy</option>
                    <option value="vintage">Vintage</option>
                    <option value="date-night">Date night</option>
                    <option value="student-spot">Student spot</option>
                    <option value="people-watching">People watching</option>
                </select>

                <label>Type tags</label>
                <select
                    multiple
                    required
                    onChange={(e) =>
                        setType([...e.target.selectedOptions].map((o) => o.value))
                    }
                >
                    <option value="brown-café">Brown café</option>
                    <option value="craft-beer-bar">Craft beer bar</option>
                    <option value="cocktail-bar">Cocktail bar</option>
                    <option value="pub">Pub</option>
                    <option value="jazz-café">Jazz café</option>
                    <option value="live-music-bar">Live music bar</option>
                    <option value="rooftop-bar">Rooftop bar</option>
                    <option value="wine-bar">Wine bar</option>
                    <option value="specialty-coffee-bar">Specialty coffee bar</option>
                </select>

                <button type="submit">Upload</button>
            </form>
        </div>
    );
}
