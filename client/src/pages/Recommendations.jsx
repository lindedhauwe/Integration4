import { useState } from "react";
import PhotoDropzone from "../components/PhotoDropzone";
// import { supabase } from "../supabase";


export default function Recommendations() {
    const [uploadedPhotos, setUploadedPhotos] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Uploaded photos:", uploadedPhotos);

        // later: opslaan in Supabase
    }

    return (
        <div>
            <h1>Recommendations</h1>
            <h2>Capture the moment</h2>
            <p>
                Did you find this place worth remembering? Leave a recommendation and
                become part of someone else’s Antwerp night.
            </p>

            <form onSubmit={handleSubmit}>
                <p>Share the vibe</p>

                <PhotoDropzone onUpload={setUploadedPhotos} />

                <label htmlFor="name">Your name</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="city">What city are you from?</label>
                <input type="text" id="city" name="city" required />

                <label htmlFor="description">Your recommendation</label>
                <textarea
                    id="description"
                    name="description"
                    required
                    maxLength={200}
                />

                <label htmlFor="rating">Tags
                    <select id="vibe" name="vibe" multiple required>
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
                    <select id="type" name="type" multiple required>
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
                </label>

                <button type="submit">Upload</button>
            </form>
        </div>
    );
}
