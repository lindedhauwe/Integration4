import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import { supabase } from "../supabase";
import Footer from "../components/Footer";
import "./thespot.css";

import arrowRight from "../assets/icons/arrow-right.svg";
import locationPin from "../assets/location-pink.svg";

export async function clientLoader({ request }) {
  const url = new URL(request.url);
  const cafeId = url.searchParams.get("cafe_id");

  if (!cafeId) return { cafe: null, recs: [] };

  const [{ data: cafe }, { data: recs }] = await Promise.all([
    supabase.from("cafés").select("*").eq("id", cafeId).single(),
    supabase.from("recommendations").select("*").eq("cafe_id", cafeId),
  ]);

  return { cafe: cafe || null, recs: recs || [] };
}
clientLoader.hydrate = true;

export default function TheSpot() {
  const { cafe, recs } = useLoaderData();
  const navigate = useNavigate();
  const [recIndex, setRecIndex] = useState(0);

  if (!cafe) {
    return (
      <div className="thespot-page">
        <button className="thespot-back" onClick={() => navigate(-1)}>
          <img src={arrowRight} alt="" className="thespot-back__icon" />
          Go back
        </button>
        <p className="thespot-notfound">Café not found.</p>
      </div>
    );
  }

  const currentRec = recs[recIndex] || null;

  function parsePhotos(photo_url) {
    try {
      const parsed = JSON.parse(photo_url);
      return Array.isArray(parsed) ? parsed : (photo_url ? [photo_url] : []);
    } catch {
      return photo_url ? [photo_url] : [];
    }
  }

  return (
    <>
    <div className="thespot-page">

      {/* HERO */}
      <div className="thespot-hero">
        {cafe.photo_url
          ? <img src={cafe.photo_url} alt={cafe.name} className="thespot-hero__img" />
          : <div className="thespot-hero__placeholder" />
        }
        <button className="thespot-back" onClick={() => navigate(-1)}>
          <img src={arrowRight} alt="" className="thespot-back__icon" />
          Go back
        </button>
      </div>

      {/* CAFÉ INFO */}
      <div className="thespot-info">
        <h1 className="thespot-info__name">{cafe.name}</h1>
        <div className="thespot-info__status">
          <span className="thespot-status thespot-status--open">Open</span>
          <span className="thespot-status__dot">•</span>
          <span className="thespot-status thespot-status--busy">Not busy</span>
        </div>
        {cafe.adress && (
          <a
            className="thespot-info__address"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.adress)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={locationPin} alt="" className="thespot-info__pin" />
            <span>{cafe.adress}</span>
          </a>
        )}
        {cafe.description && (
          <p className="thespot-info__description">{cafe.description}</p>
        )}
      </div>

      {/* QUOTE */}
      <div className="thespot-quote">
        <div className="thespot-quote__deco" />
        <p className="thespot-quote__text">
          Every great spot <span>deserves a<br />great beer!</span>
        </p>
      </div>

      {/* VIBE / BEER */}
      {cafe.vibe_tags?.length > 0 && (
        <div className="thespot-vibe">
          <p className="thespot-vibe__name">{cafe.beer_name || "House special"}</p>
          <div className="thespot-vibe__tags">
            {cafe.vibe_tags.map((t) => (
              <span key={t} className="thespot-vibe__tag">#{t}</span>
            ))}
          </div>
          {cafe.beer_description && (
            <p className="thespot-vibe__desc">{cafe.beer_description}</p>
          )}
        </div>
      )}

      {/* STORIES */}
      {recs.length > 0 && (
        <div className="thespot-stories">
          <h2 className="thespot-stories__title">Stories &<br />recommendations</h2>

          <div className="thespot-story-card">
            <span className="thespot-story__author">
              {currentRec.name} ({currentRec.age}y) • {currentRec.city}
            </span>
            <p className="thespot-story__text">{currentRec.description}</p>

            {parsePhotos(currentRec.photo_url).length > 0 && (
              <img
                src={parsePhotos(currentRec.photo_url)[0]}
                alt=""
                className="thespot-story__photo"
              />
            )}
          </div>

          {recs.length > 1 && (
            <div className="thespot-story__dots">
              {recs.map((_, i) => (
                <span
                  key={i}
                  className={`thespot-story__dot ${i === recIndex ? "thespot-story__dot--active" : ""}`}
                  onClick={() => setRecIndex(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
    <Footer />
    </>
  );
}
