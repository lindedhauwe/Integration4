import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import { supabase } from "../supabase";
import Footer from "../components/Footer";
import "./thespot.css";

import arrowRight from "../assets/icons/arrow-right.svg";
import locationPin from "../assets/location-pink.svg";
import rectTop      from "../assets/images/rect-top-detailPage.png";
import rectSide     from "../assets/images/rect-side-detailPage.png";
import areaBeige    from "../assets/images/area-beige-detailPage.png";
import pinkPixels   from "../assets/images/pink-pixels-detailPage.png";
import sparkOrange  from "../assets/images/spark-orange-detailPage.png";
import seefImg      from "../assets/images/seef.png";
import titleCafeLine from "../assets/images/title-cafe-line-detailPage.png";

function getOpenStatus(opening_hours) {
  if (!opening_hours || Object.keys(opening_hours).length === 0) return null;
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const now = new Date();
  const range = opening_hours[days[now.getDay()]];
  if (!range) return { isOpen: false };
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const [openStr, closeStr] = range.split("-");
  const openMin = toMin(openStr);
  let closeMin = toMin(closeStr);
  if (closeMin < openMin) closeMin += 24 * 60;
  return { isOpen: nowMin >= openMin && nowMin < closeMin, hours: range };
}

export async function clientLoader({ request }) {
  const url = new URL(request.url);
  const cafeId = url.searchParams.get("cafe_id");

  if (!cafeId) return { cafe: null, recs: [], spots: [] };

  const [{ data: cafe }, { data: recs }, { data: spots }] = await Promise.all([
    supabase.from("cafés").select("*").eq("id", cafeId).single(),
    supabase.from("recommendations").select("*").eq("cafe_id", cafeId),
    supabase.from("spots").select("*").eq("cafe_id", cafeId),
  ]);

  return { cafe: cafe || null, recs: recs || [], spots: spots || [] };
}
clientLoader.hydrate = true;

export default function TheSpot() {
  const { cafe, recs, spots } = useLoaderData();
  const navigate = useNavigate();
  const [recIndex, setRecIndex] = useState(0);
  const [spotIndex, setSpotIndex] = useState(0);

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

  const status = getOpenStatus(cafe.opening_hours);
  const currentRec = recs[recIndex] || null;
  const currentSpot = spots[spotIndex] || null;

  const vibeTags = Array.isArray(cafe.vibe_tags)
    ? cafe.vibe_tags
    : (cafe.vibe_tags ? String(cafe.vibe_tags).split(",").map((t) => t.trim()) : []);

  function shortAddress(adress) {
    if (!adress) return adress;
    return adress.replace(/,?\s*\d{4}\s+/, ", ");
  }

  function parsePhotos(photo_url) {
    try {
      const parsed = JSON.parse(photo_url);
      return Array.isArray(parsed) ? parsed : (photo_url ? [photo_url] : []);
    } catch {
      return photo_url ? [photo_url] : [];
    }
  }

  function prevSpot() { setSpotIndex((i) => (i - 1 + spots.length) % spots.length); }
  function nextSpot() { setSpotIndex((i) => (i + 1) % spots.length); }

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
        <img src={rectTop} alt="" className="thespot-hero__rect-top" />
      </div>

      {/* CAFÉ INFO */}
      <div className="thespot-info">
        <img src={rectSide} alt="" className="thespot-info__rect-side" />
        <div className="thespot-info__name-row">
          <h1 className="thespot-info__name">{cafe.name}</h1>
          <img src={titleCafeLine} alt="" className="thespot-info__name-line" />
        </div>
        <div className="thespot-info__status-row">
          <div className="thespot-info__status">
            <span className={`thespot-status ${status && !status.isOpen ? "thespot-status--closed" : "thespot-status--open"}`}>
              {status ? (status.isOpen ? "Open" : "Closed") : "Open"}
            </span>
            <span className="thespot-status__square" />
            <span className="thespot-status thespot-status--open">Not busy</span>
          </div>
          {cafe.adress && (
            <a
              className="thespot-info__address"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.adress)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={locationPin} alt="" className="thespot-info__pin" />
              <span>{shortAddress(cafe.adress)}</span>
            </a>
          )}
        </div>
        {cafe.description && (
          <p className="thespot-info__description">{cafe.description}</p>
        )}
      </div>

      {/* QUOTE */}
      <div className="thespot-quote">
        <img src={pinkPixels} alt="" className="thespot-quote__pixels" />
        <img src={sparkOrange} alt="" className="thespot-quote__spark" />
        <p className="thespot-quote__text">
          Every great spot <span>deserves a<br />great beer!</span>
        </p>
        <img src={seefImg} alt="beer" className="thespot-quote__beer" />
      </div>

      {/* VIBE / BEER */}
      <div className="thespot-vibe">
        <img src={areaBeige} alt="" className="thespot-vibe__bg" />
        <div className="thespot-vibe__content">
          <p className="thespot-vibe__name">{cafe.beer_name || "House special"}</p>
          {vibeTags.length > 0 && (
            <div className="thespot-vibe__tags">
              {vibeTags.map((t) => (
                <span key={t} className="thespot-vibe__tag">#{t}</span>
              ))}
            </div>
          )}
          {cafe.beer_description && (
            <p className="thespot-vibe__desc">{cafe.beer_description}</p>
          )}
        </div>
      </div>

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

      {/* NEIGHBOURHOOD */}
      {spots.length > 0 && currentSpot && (
        <div className="thespot-neighbourhood">
          <h2 className="thespot-neighbourhood__title">
            Discover the<br /><span>neighbourhood.</span>
          </h2>

          <div className="thespot-neighbourhood__card">
            {/* PHOTO */}
            <div className="thespot-neighbourhood__photo-wrap">
              {currentSpot.photo_url && currentSpot.photo_url !== "placeholder.jpg"
                ? <img src={currentSpot.photo_url} alt={currentSpot.name} className="thespot-neighbourhood__photo" />
                : <div className="thespot-neighbourhood__photo-placeholder" />
              }
            </div>

            {/* META */}
            <div className="thespot-neighbourhood__meta">
              <span className="thespot-neighbourhood__walk">🚶 {currentSpot.walk_minutes} min</span>
              <span className="thespot-neighbourhood__counter">
                Spot {spotIndex + 1} out of {spots.length}
              </span>
            </div>

            {/* SPOT INFO */}
            <h3 className="thespot-neighbourhood__name">{currentSpot.name}</h3>

            {currentSpot.address && (
              <p className="thespot-neighbourhood__address">
                <img src={locationPin} alt="" className="thespot-neighbourhood__pin" />
                {currentSpot.address}
              </p>
            )}

            {Array.isArray(currentSpot.tags) && currentSpot.tags.length > 0 && (
              <div className="thespot-neighbourhood__tags">
                {currentSpot.tags.map((t) => (
                  <span key={t} className="thespot-neighbourhood__tag">#{t}</span>
                ))}
              </div>
            )}

            {/* NAV ARROWS */}
            {spots.length > 1 && (
              <div className="thespot-neighbourhood__nav">
                <button className="thespot-neighbourhood__arrow" onClick={prevSpot}>
                  <img src={arrowRight} alt="prev" className="thespot-neighbourhood__arrow-icon thespot-neighbourhood__arrow-icon--flip" />
                </button>
                <button className="thespot-neighbourhood__arrow" onClick={nextSpot}>
                  <img src={arrowRight} alt="next" className="thespot-neighbourhood__arrow-icon" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
    <Footer />
    </>
  );
}
