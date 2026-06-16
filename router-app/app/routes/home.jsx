import { useLoaderData, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import "./home.css";
import Footer from "../components/Footer";
import HomeButton from "../components/HomeButton";

import locationPin from "../assets/icons/location-pink.svg";
import fullHeart from "../assets/icons/fullheart.svg";
import emptyHeart from "../assets/icons/emptyheart.svg";
import shuffleIcon from "../assets/icons/shuffle.svg";
import arrowRight from "../assets/icons/arrow-right.svg";

export async function clientLoader({ request }) {
  const url = new URL(request.url);
  const cafeId = url.searchParams.get("cafe");

  const [{ data: all }, { data: cafes }] = await Promise.all([
    supabase.from("recommendations").select("*"),
    supabase.from("cafés").select("id, name, adress, vibe_tags, gps_lat, gps_lng"),
  ]);

  const allRecs = all || [];
  const cafeMap = Object.fromEntries((cafes || []).map((c) => [c.id, c]));

  let filtered = allRecs;

  if (cafeId && allRecs.length) {
    const vibeTags = cafeMap[cafeId]?.vibe_tags;
    if (vibeTags?.length) {
      const vibeFiltered = allRecs.filter(
        (r) =>
          r.cafe_id !== cafeId &&
          r.vibe_tags?.some((v) => vibeTags.includes(v))
      );
      if (vibeFiltered.length) filtered = vibeFiltered;
    }
  }

  // Sla gescande café op voor map (localStorage) en recommendations pagina (sessionStorage)
  if (cafeId && cafeMap[cafeId]) {
    const c = cafeMap[cafeId];
    const newCurrent = { id: c.id, name: c.name, lat: c.gps_lat, lng: c.gps_lng };

    // Zet vorige "current" in visited als het een ander café is
    try {
      const oldCurrent = JSON.parse(localStorage.getItem("current_cafe") || "null");
      if (oldCurrent && oldCurrent.id !== newCurrent.id) {
        const visited = JSON.parse(localStorage.getItem("visited_cafes") || "[]");
        if (!visited.find((v) => v.id === oldCurrent.id)) {
          visited.push(oldCurrent);
          localStorage.setItem("visited_cafes", JSON.stringify(visited));
        }
      }
    } catch {}

    localStorage.setItem("current_cafe", JSON.stringify({ id: c.id, name: c.name, adress: c.adress, lat: c.gps_lat, lng: c.gps_lng }));
    sessionStorage.setItem("current_cafe", JSON.stringify({ id: c.id, name: c.name, adress: c.adress }));
  }

  return { filtered, all: allRecs, cafeMap, scannedCafeId: cafeId };
}
clientLoader.hydrate = true;

function getLikedCafes() {
  try {
    return JSON.parse(localStorage.getItem("liked_cafes") || "[]");
  } catch {
    return [];
  }
}

function saveLikedCafe(cafe) {
  const liked = getLikedCafes();
  if (!liked.find((c) => c.cafe_id === cafe.cafe_id)) {
    liked.push(cafe);
    localStorage.setItem("liked_cafes", JSON.stringify(liked));
  }
}

function removeLikedCafe(cafeId) {
  const liked = getLikedCafes().filter((c) => c.cafe_id !== cafeId);
  localStorage.setItem("liked_cafes", JSON.stringify(liked));
}

export default function Home() {
  const { filtered, all, cafeMap, scannedCafeId } = useLoaderData();
  const navigate = useNavigate();
  const scannedCafeName = scannedCafeId ? (cafeMap[scannedCafeId]?.name || "") : "";

  const [rec, setRec] = useState(() => {
    // Als de cafe param veranderd (nieuwe NFC scan), reset opgeslagen rec
    const currentCafeId = new URL(window.location.href).searchParams.get("cafe") || "";
    const savedCafeId = sessionStorage.getItem("home_cafe_id") || "";
    if (savedCafeId !== currentCafeId) {
      sessionStorage.setItem("home_cafe_id", currentCafeId);
      sessionStorage.removeItem("home_rec_id");
    }

    // Herstel opgeslagen rec als die nog in de data zit
    const savedId = sessionStorage.getItem("home_rec_id");
    if (savedId) {
      const found = filtered.find((r) => String(r.id) === savedId)
                 || all.find((r) => String(r.id) === savedId);
      if (found) return found;
    }

    // Eerste keer: random uit filtered
    const pool = filtered.length ? filtered : all;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (chosen) sessionStorage.setItem("home_rec_id", String(chosen.id));
    return chosen;
  });

  const [mediaIndex, setMediaIndex] = useState(0);
  const [liked, setLiked] = useState(() => getLikedCafes());
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!rec) {
    return <main className="home-page"><p className="home-empty">Geen aanbevelingen gevonden.</p></main>;
  }

  // "another bar" → rec.cafe_name/rec.location, "current bar" → naam uit cafes tabel
  const cafeName = rec.cafe_name || cafeMap[rec.cafe_id]?.name || rec.location || "Onbekend café";
  const cafeAddress = cafeMap[rec.cafe_id]?.adress || rec.location || "";

  // Sla de aanbevolen bar op voor de map (grijze pin)
  const recCafe = cafeMap[rec.cafe_id];
  if (recCafe?.gps_lat && recCafe?.gps_lng) {
    sessionStorage.setItem(
      "rec_cafe",
      JSON.stringify({ id: rec.cafe_id, name: cafeName, adress: cafeAddress, lat: recCafe.gps_lat, lng: recCafe.gps_lng })
    );
    sessionStorage.setItem(
      "home_rec",
      JSON.stringify({ name: rec.name, age: rec.age, description: rec.description, photo_url: rec.photo_url, cafe_name: cafeName })
    );
  }

  // parse photo_url: kan een JSON array zijn (meerdere fotos) of een enkele URL string
  let photoUrls = [];
  try {
    const parsed = JSON.parse(rec.photo_url);
    photoUrls = Array.isArray(parsed) ? parsed : (rec.photo_url ? [rec.photo_url] : []);
  } catch {
    if (rec.photo_url) photoUrls = [rec.photo_url];
  }
  const media = [...photoUrls, rec.video_url].filter(Boolean);
  const isLiked = !!rec.cafe_id && !!localStorage.getItem('user') && liked.some((c) => c.cafe_id === rec.cafe_id);

  function shuffle() {
    let newRec;
    do {
      newRec = all[Math.floor(Math.random() * all.length)];
    } while (newRec?.id === rec?.id && all.length > 1);
    sessionStorage.setItem("home_rec_id", String(newRec.id));
    setRec(newRec);
    setMediaIndex(0);
  }

  function prevMedia() {
    setMediaIndex((i) => (i - 1 + media.length) % media.length);
  }

  function nextMedia() {
    setMediaIndex((i) => (i + 1) % media.length);
  }

  const touchStartX = useRef(null);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextMedia() : prevMedia();
    }
    touchStartX.current = null;
  }

  async function toggleLike() {
    if (!localStorage.getItem("user")) {
      setShowLoginModal(true);
      return;
    }

    if (isLiked) {
      removeLikedCafe(rec.cafe_id);
      setLiked(getLikedCafes());
      return;
    }

    // fetch GPS from cafes table
    let lat = null, lng = null, name = cafeName, adress = cafeAddress;
    if (rec.cafe_id) {
      const { data } = await supabase
        .from("cafés")
        .select("name, adress, gps_lat, gps_lng")
        .eq("id", rec.cafe_id)
        .single();
      if (data) {
        lat = data.gps_lat;
        lng = data.gps_lng;
        name = data.name || cafeName;
        adress = data.adress || "";
      }
    }

    saveLikedCafe({ cafe_id: rec.cafe_id, name, adress, lat, lng });
    setLiked(getLikedCafes());
  }

  function visitSpot() {
    // navigate to detail page — route nog te maken
    navigate(`/thespot?cafe_id=${rec.cafe_id || ""}&name=${encodeURIComponent(cafeName)}`);
  }

  return (
    <>
    {showLoginModal && (
      <div className="home-login-overlay" onClick={() => setShowLoginModal(false)}>
        <div className="home-login-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="home-login-modal__title">Want to save this recommendation?</h2>
          <p className="home-login-modal__text">Create an account to save recommendations and build your pub crawl.</p>
          <div className="home-login-modal__actions">
            <button className="home-login-modal__btn home-login-modal__btn--outline" onClick={() => setShowLoginModal(false)}>
              Close
            </button>
            <button className="home-login-modal__btn home-login-modal__btn--filled" onClick={() => navigate("/login")}>
              Log in
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="home-wrapper">
    <div className="home-page">
      {/* HERO */}
      <section className="home-hero">
        <p className="home-hero__name">{rec.name} ({rec.age})</p>
        <h1 className="home-hero__title">recommends you...</h1>
      </section>

      {/* CAFÉ NAME — boven de card */}
      <div className="home-card__header">
        <span className="home-card__cafe-name">{cafeName}</span>
        <button className="home-card__heart-btn" onClick={toggleLike}>
          <img src={isLiked ? fullHeart : emptyHeart} alt="like" className={isLiked ? "heart--liked" : ""} />
        </button>
      </div>

      {/* ADDRESS — onder café naam, boven card */}
      {cafeAddress && (
        <a
          className="home-card__address"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafeName + ' ' + cafeAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={locationPin} alt="" className="home-card__pin" />
          <span>{cafeAddress}</span>
        </a>
      )}

      {/* CARD */}
      <div className="home-card">

        {/* media carousel */}
        <div className="home-card__photo-wrap" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {media.length > 0 ? (
            media[mediaIndex]?.match(/\.(mp4|webm|mov)$/i) ? (
              <video
                src={media[mediaIndex]}
                className="home-card__photo"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img src={media[mediaIndex]} alt="recommendation" className="home-card__photo" />
            )
          ) : (
            <div className="home-card__photo-placeholder">
              <span className="home-card__no-photo">No photo taken</span>
            </div>
          )}

          {media.length > 1 && (
            <>
              <button className="home-card__arrow home-card__arrow--left" onClick={prevMedia}>
                <img src={arrowRight} alt="prev" className="home-card__arrow-icon home-card__arrow-icon--flip" />
              </button>
              <button className="home-card__arrow home-card__arrow--right" onClick={nextMedia}>
                <img src={arrowRight} alt="next" className="home-card__arrow-icon" />
              </button>
              <div className="home-card__dots">
                {media.map((_, i) => (
                  <span
                    key={i}
                    className={`home-card__dot ${i === mediaIndex ? "home-card__dot--active" : ""}`}
                    onClick={() => setMediaIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* body */}
        <div className="home-card__body">
          <p className="home-card__recommender">{rec.name} ({rec.age})</p>
          <p className="home-card__description">{rec.description}</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="home-actions">
        <button className="home-actions__shuffle" onClick={shuffle}>
          <img src={shuffleIcon} alt="shuffle" />
        </button>
        <button className="home-actions__visit" onClick={visitSpot}>
          Visit this spot
          <img src={arrowRight} alt="" className="home-actions__visit-arrow" />
        </button>
      </div>

    </div>
    <Footer hideShare />
    </div>
    </>
  );
}
