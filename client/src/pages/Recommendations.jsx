import { useState } from "react";
import PhotoDropzone from "../components/PhotoDropzone";
import { supabase } from "../supabase";
import "./Recommendations.css";
import recommendationCollage from "../assets/images/recommatationCollage.png";
import recommendationPeaceHand from "../assets/icons/recommendationPeaceHand.png";

export default function Recommendations() {
  const [mode, setMode] = useState("current");

  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [vibe, setVibe] = useState([]);
  const [type, setType] = useState([]);

  const vibeOptions = [
    "authentic",
    "cozy",
    "hiddenGem",
    "localFavorite",
    "lateNight",
    "lively",
    "chill",
    "artsy",
  ];

  const typeOptions = [
    "brownCafe",
    "craftBeerBar",
    "cocktailBar",
    "pub",
    "rooftopBar",
  ];

  function toggleTag(value, list, setList) {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (vibe.length === 0 || type.length === 0) {
      alert("Select at least one tag");
      return;
    }

    const { error } = await supabase.from("recommendations").insert({
      name,
      city,
      description,
      location,
      vibe_tags: vibe,
      type_tags: type,
      photo_url: uploadedMedia[0] || null,
    });

    if (error) {
      console.error(error);
      alert("Error saving recommendation");
      return;
    }

    alert("Saved!");
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-content">
        <div className="mode-switch" role="tablist">
          <button
            type="button"
            role="tab"
            className={mode === "current" ? "active" : ""}
            aria-selected={mode === "current"}
            onClick={() => setMode("current")}
          >
            Current bar
          </button>
          <button
            type="button"
            role="tab"
            className={mode === "another" ? "active" : ""}
            aria-selected={mode === "another"}
            onClick={() => setMode("another")}
          >
            Another bar
          </button>
        </div>

        <div className="hero">
          <p className="small">You're currently at...</p>
          <h1>Café Beveren</h1>
          <div className="location">📍 Vlasmarkt 2, Antwerp</div>
        </div>

        <div className="intro">
          <h2>Capture the moment</h2>
          <p>
            Did you find this place worth remembering? Leave a recommendation
            and become part of someone else's Antwerp night.
          </p>
          <img
            src={recommendationCollage}
            alt="Antwerp collage"
            className="intro-collage"
          />
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label>Select the location*</label>
          <input
            placeholder="Type here..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <p className="section-title">Share the vibe</p>
          <PhotoDropzone onUpload={setUploadedMedia} />

          <label>Your first name*</label>
          <input
            placeholder="e.g Anna"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Your age*</label>
          <input placeholder="" />

          <label>What city are you from?*</label>
          <input
            placeholder="e.g Antwerp"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <label>Your recommendation*</label>
          <textarea
            maxLength={350}
            placeholder="What makes this place special to you?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className="char-count">{description.length}/350</span>

          <div className="tags-wrapper">
            <p>Tags</p>

            <div>
              <span className="tag-label">Vibe</span>
              <div className="tags">
                {vibeOptions.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={`tag blue ${vibe.includes(tag) ? "active" : ""}`}
                    onClick={() => toggleTag(tag, vibe, setVibe)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="tag-label">Type</span>
              <div className="tags">
                {typeOptions.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={`tag green ${type.includes(tag) ? "active" : ""}`}
                    onClick={() => toggleTag(tag, type, setType)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="submit-btn" type="submit">
            Upload ↑
          </button>
          <img
            src={recommendationPeaceHand}
            alt="Peace hand"
            className="peace-hand"
          />
        </form>
      </div>
    </div>
  );
}
