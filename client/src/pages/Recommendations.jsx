import { useState } from "react";
import PhotoDropzone from "../components/PhotoDropzone";
import { supabase } from "../supabase";
import "./Recommendations.css";

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
    <div className="container">
  <div className="content">
    {/* SWITCH */}
    <div className="mode-switch" role="tablist">
      <button
        role="tab"
        className={mode === "current" ? "active" : ""}
        aria-selected={mode === "current"}
        onClick={() => setMode("current")}
      >
        Current bar
      </button>
      <button
        role="tab"
        className={mode === "another" ? "active" : ""}
        aria-selected={mode === "another"}
        onClick={() => setMode("another")}
      >
        Another bar
      </button>
    </div>

    {/* HEADER BLOCK */}
    <div className="hero">
      <p className="small">You're currently at...</p>
      <h1>Café Beveren</h1>
      <div className="location">📍 Vlasmarkt 2, Antwerp</div>
    </div>

    {/* TEXT BLOCK */}
    <div className="intro">
      <h2>Capture the moment</h2>
      <p>
        Did you find this place worth remembering? Leave a recommendation
        and become part of someone else's Antwerp night.
      </p>
    </div>

    {/* FORM */}
    <form onSubmit={handleSubmit} className="form">
      <label>Select the location*</label>
      <input placeholder="Type here..." />

      <p className="section-title">Share the vibe</p>
      <PhotoDropzone onUpload={setUploadedMedia} />

      <label>Your first name*</label>
      <input placeholder="e.g Anna" value={name} onChange={(e)=>setName(e.target.value)} />

      <label>Your age*</label>
      <input />

      <label>What city are you from?*</label>
      <input placeholder="e.g Antwerp" value={city} onChange={(e)=>setCity(e.target.value)} />

      <label>Your recommendation*</label>
      <textarea
        maxLength={350}
        placeholder="What makes this place special to you?"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />
      <span className="char-count">{description.length}/350</span>

      {/* TAGS */}
      <div className="tags-wrapper">
        <p>Tags</p>

        <div>
          <span className="tag-label">Vibe</span>
          <div className="tags">
            {vibeOptions.map(tag => (
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
            {typeOptions.map(tag => (
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

      <button className="submit-btn">Upload ↑</button>
    </form>
  </div>
</div>
  );
}
