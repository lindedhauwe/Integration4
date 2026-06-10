import { useState, useEffect } from "react";
import { Form, useActionData } from "react-router";
import "./recommendations.css";
import PhotoDropzone from "~/components/PhotoDropzone";

import recommendationCollage from "~/assets/images/recommendationCollageSimple.png";
import anotherBarCollage from "~/assets/images/anotherBarCollage.png";
import recommendationPeaceHand from "~/assets/icons/recommendationPeaceHand.png";
import recommendationBeigeRect from "~/assets/images/recommendationBeigeRect.png";
import recommendationRectSmall from "~/assets/images/RecommendationRectSmall.png";
import uploadIcon from "~/assets/icons/iconupload.svg";
import errorIcon from "~/assets/icons/error.svg";

export async function clientAction({ request }) {
  const { supabase } = await import("../supabase");
  const formData = await request.formData();

  const name = formData.get("name");
  const age = formData.get("age");
  const city = formData.get("city");
  const description = formData.get("description");
  const location = formData.get("location");
  const vibe = JSON.parse(formData.get("vibe") || "[]");
  const type = JSON.parse(formData.get("type") || "[]");
  const photo_url = formData.get("photo_url");

  const { error } = await supabase.from("recommendations").insert({
    name,
    age: age || null,
    city,
    description,
    location: location || null,
    vibe_tags: vibe,
    type_tags: type,
    photo_url,
  });

  if (error) return { error: error.message };
  return { success: true };
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
  const [age, setAge] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function resetForm() {
    setName("");
    setCity("");
    setDescription("");
    setLocation("");
    setAge("");
    setVibe([]);
    setType([]);
    setUploadedMedia([]);
    setSubmitted(false);
  }

  useEffect(() => {
    if (actionData?.success) resetForm();
  }, [actionData]);

  const errors = submitted ? {
    location: mode === "another" && !location.trim() ? "Please select location" : null,
    name: !name.trim() ? "Please fill in your name" : null,
    age: !age.trim() ? "Please select your age" : null,
    city: !city.trim() ? "Please enter your hometown" : null,
    description: description.trim().length < 15 ? "At least 15 characters" : null,
  } : {};

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

  function FieldError({ msg }) {
    if (!msg) return null;
    return (
      <span className="field-error">
        <img src={errorIcon} alt="" className="field-error__icon" />
        {msg}
      </span>
    );
  }

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
          <button className={mode === "current" ? "active" : ""} onClick={() => { setMode("current"); resetForm(); }}>
            Current bar
          </button>

          <button className={mode === "another" ? "active" : ""} onClick={() => { setMode("another"); resetForm(); }}>
            Another bar
          </button>
        </div>

        {mode === "current" ? (
          <>
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
          </>
        ) : (
          <div className="another-hero">
            <h1>Recommend another bar</h1>
            <p>Share a place that feel personal, local or unexpectedly memorable.</p>
            <img src={anotherBarCollage} className="another-collage" />
          </div>
        )}

        {/* ⭐ REACT ROUTER FORM */}
        <Form method="post" className="form">
          {actionData?.error && <p className="error">Error: {actionData.error}</p>}
          {actionData?.success && <p className="success">Saved!</p>}

          {mode === "another" && (
            <>
              <label>Select the location*</label>
              <input
                name="location"
                placeholder="Type here..."
                value={location}
                className={errors.location ? "input-error" : ""}
                onChange={(e) => setLocation(e.target.value)}
              />
              <FieldError msg={errors.location} />
            </>
          )}

          <p className="section-title">Share the vibe</p>
          <PhotoDropzone onUpload={setUploadedMedia} />

          <label>Your first name*</label>
          <input
            name="name"
            placeholder="e.g Anna"
            value={name}
            className={errors.name ? "input-error" : ""}
            onChange={(e) => setName(e.target.value)}
          />
          <FieldError msg={errors.name} />

          <label>Your age*</label>
          <input
            name="age"
            placeholder=""
            value={age}
            className={errors.age ? "input-error" : ""}
            onChange={(e) => setAge(e.target.value)}
          />
          <FieldError msg={errors.age} />

          <label>What city are you from?*</label>
          <input
            name="city"
            placeholder="e.g Antwerp"
            value={city}
            className={errors.city ? "input-error" : ""}
            onChange={(e) => setCity(e.target.value)}
          />
          <FieldError msg={errors.city} />

          <label>Your recommendation*</label>
          <textarea
            name="description"
            maxLength={350}
            placeholder="What makes this place special to you?"
            value={description}
            className={errors.description ? "input-error" : ""}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className={`char-count ${errors.description ? "char-count--error" : ""}`}>
            {description.length}/350{errors.description ? ` — ${errors.description}` : ""}
          </span>

          <div className="tags-wrapper">
            <p>Tags</p>

            <div>
              <span className="tag-label">Vibe</span>
              <div className="tags">
                {vibeOptions.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className="tag blue"
                    onClick={() => toggleTag(tag, vibe, setVibe)}
                  >
                    #{tag}
                    {vibe.includes(tag) && <span className="tag__remove">✕</span>}
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
                    className="tag green"
                    onClick={() => toggleTag(tag, type, setType)}
                  >
                    #{tag}
                    {type.includes(tag) && <span className="tag__remove">✕</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ⭐ HIDDEN INPUTS VOOR SERVER */}
          <input type="hidden" name="vibe" value={JSON.stringify(vibe)} />
          <input type="hidden" name="type" value={JSON.stringify(type)} />
          <input type="hidden" name="photo_url" value={uploadedMedia[0] || ""} />

          <button
            className="submit-btn"
            type="submit"
            onClick={(e) => {
              setSubmitted(true);
              const hasErrors =
                (mode === "another" && !location.trim()) ||
                !name.trim() ||
                !age.trim() ||
                !city.trim() ||
                description.trim().length < 15;
              if (hasErrors) e.preventDefault();
            }}
          >
            Upload
            <img src={uploadIcon} alt="" className="submit-btn__icon" />
          </button>

        </Form>
      </div>

      <img src={recommendationPeaceHand} className="peace-hand" />
    </div>
  );
}

