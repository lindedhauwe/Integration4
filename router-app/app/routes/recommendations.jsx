import { useState } from "react";
import { Form, useActionData } from "react-router";
import "./recommendations.css";
import PhotoDropzone from "~/components/PhotoDropzone";

import recommendationCollage from "~/assets/images/recommendationCollageSimple.png";
import recommendationPeaceHand from "~/assets/icons/recommendationPeaceHand.png";
import recommendationBeigeRect from "~/assets/images/recommendationBeigeRect.png";
import recommendationBrownStroke from "~/assets/images/RecommendationBrownStroke.png";
import recommendationRectSmall from "~/assets/images/RecommendationRectSmall.png";

export async function action({ request }) {
  const formData = await request.formData();

  const name = formData.get("name");
  const city = formData.get("city");
  const description = formData.get("description");
  const location = formData.get("location");
  const vibe = JSON.parse(formData.get("vibe"));
  const type = JSON.parse(formData.get("type"));
  const photo_url = formData.get("photo_url");

  const { supabase } = await import("~/supabase.server");

  const { error } = await supabase.from("recommendations").insert({
    name,
    city,
    description,
    location,
    vibe_tags: vibe,
    type_tags: type,
    photo_url,
  });

  if (error) {
    return { error: error.message }; // 👈 GEEN json()
  }

  return { success: true }; // 👈 GEEN redirect()
}


export default function Recommendations() {
  const actionData = useActionData();

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

  return (
    <div className="recommendations-page">
      <img src={recommendationBeigeRect} className="bg-shape bg-shape--bottom-left" />
      <img src={recommendationRectSmall} className="bg-shape bg-shape--top-left" />

      <div className="recommendations-content">
        <div className={`mode-switch ${mode === "another" ? "another" : ""}`} role="tablist">
          <button className={mode === "current" ? "active" : ""} onClick={() => setMode("current")}>
            Current bar
          </button>

          <button className={mode === "another" ? "active" : ""} onClick={() => setMode("another")}>
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
          <img src={recommendationCollage} className="intro-collage" />
        </div>

        {/* ⭐ REACT ROUTER FORM */}
        <Form method="post" className="form">
          {actionData?.error && (
            <p className="error">Error: {actionData.error}</p>
          )}
          {actionData?.success && (
            <p className="success">Saved!</p>
          )}

          <label>Select the location*</label>
          <input
            name="location"
            placeholder="Type here..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <p className="section-title">Share the vibe</p>
          <PhotoDropzone onUpload={setUploadedMedia} />

          <label>Your first name*</label>
          <input
            name="name"
            placeholder="e.g Anna"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Your age*</label>
          <input placeholder="" />

          <label>What city are you from?*</label>
          <input
            name="city"
            placeholder="e.g Antwerp"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <label>Your recommendation*</label>
          <textarea
            name="description"
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

          {/* ⭐ HIDDEN INPUTS VOOR SERVER */}
          <input type="hidden" name="vibe" value={JSON.stringify(vibe)} />
          <input type="hidden" name="type" value={JSON.stringify(type)} />
          <input type="hidden" name="photo_url" value={uploadedMedia[0] || ""} />

          <button className="submit-btn" type="submit">
            Upload ↑
          </button>

          <img src={recommendationPeaceHand} className="peace-hand" />
        </Form>
      </div>
    </div>
  );
}

