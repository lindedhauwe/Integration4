import { useState, useRef } from "react";
import { supabase } from "../supabase";
import Footer from "../components/Footer";
import HomeButton from "../components/HomeButton";
import "./thespot.css";

import arrowRight from "../assets/icons/arrow-right.svg";
import walkIcon   from "../assets/icons/walk.svg";
import locationPin from "../assets/icons/location-pink.svg";
import rectTop      from "../assets/images/rect-top-detailPage.png";
import rectSide     from "../assets/images/rect-side-detailPage.png";
import areaBeige    from "../assets/images/area-beige-detailPage.png";
import pinkPixels   from "../assets/images/pink-pixels-detailPage.png";
import sparkOrange  from "../assets/images/spark-orange-detailPage.png";
import seefImg      from "../assets/images/seef.png";
import bollekaImg   from "../assets/images/bolleke-de-konink-detail.png";
import titleCafeLine from "../assets/images/title-cafe-line-detailPage.png";
import greenLine     from "../assets/images/greenLine-detailPage.png";
import popupBg       from "../assets/images/bg-popup-detail.png";
import popupLine     from "../assets/images/line-popup-detail.png";
import closeIcon     from "../assets/icons/close.svg";

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

export default function TheSpot({ loaderData }) {
  const { cafe, recs, spots } = loaderData;
  const [recIndex, setRecIndex] = useState(0);
  const [spotIndex, setSpotIndex] = useState(0);
  const [showHoursPopup, setShowHoursPopup] = useState(false);
  const [chartDay, setChartDay] = useState(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()]);
  const touchStartX = useRef(null);

  const busynessData = {
    Mon: [10, 20, 35, 40, 50, 45, 55, 50, 30],
    Tue: [15, 25, 40, 45, 55, 50, 60, 55, 35],
    Wed: [10, 20, 30, 40, 45, 40, 50, 45, 25],
    Thu: [20, 35, 50, 55, 65, 60, 70, 65, 40],
    Fri: [20, 35, 55, 50, 70, 65, 60, 70, 45],
    Sat: [30, 50, 65, 70, 80, 75, 85, 80, 55],
    Sun: [25, 40, 55, 60, 65, 55, 60, 50, 30],
  };

  // 9 bars evenly from 10am to 10pm (every 1.5h)
  const barTimes = [10, 11.5, 13, 14.5, 16, 17.5, 19, 20.5, 22];

  const getAdjustedBars = () => {
    const dayKey = chartDay.toLowerCase();
    const range = cafe.opening_hours?.[dayKey];
    const bars = busynessData[chartDay] || busynessData.Mon;
    if (!range) return bars.map(() => 0);
    const toHour = (t) => { const [h, m] = t.split(":").map(Number); return h + m / 60; };
    const [openStr, closeStr] = range.split("-");
    let openHour = toHour(openStr);
    let closeHour = toHour(closeStr);
    if (closeHour <= openHour) closeHour += 24;
    return bars.map((h, i) => (barTimes[i] >= openHour && barTimes[i] < closeHour) ? h : 0);
  };

  if (!cafe) {
    return (
      <div className="thespot-page">
        <HomeButton />
        <p className="thespot-notfound">Café not found.</p>
      </div>
    );
  }

  const status = getOpenStatus(cafe.opening_hours);
  const currentRec = recs[recIndex] || null;
  const currentSpot = spots[spotIndex] || null;

  const vibeTags = (() => {
    if (!cafe.vibe_tags) return [];
    if (Array.isArray(cafe.vibe_tags)) return cafe.vibe_tags;
    const s = String(cafe.vibe_tags).trim();
    try { const p = JSON.parse(s); if (Array.isArray(p)) return p; } catch {}
    // PostgreSQL array format: {tag1,tag2}
    if (s.startsWith("{") && s.endsWith("}")) return s.slice(1, -1).split(",").map((t) => t.trim().replace(/^"|"$/g, ""));
    return s.split(",").map((t) => t.trim());
  })();

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

  const beerImg = cafe.beer_name?.toLowerCase().includes("bolleke") || cafe.beer_name?.toLowerCase().includes("koninck")
    ? bollekaImg
    : seefImg;

  function prevSpot() { setSpotIndex((i) => (i - 1 + spots.length) % spots.length); }
  function nextSpot() { setSpotIndex((i) => (i + 1) % spots.length); }

  const neighbourhoodTouchX = useRef(null);

  function handleNeighbourhoodTouchStart(e) {
    neighbourhoodTouchX.current = e.touches[0].clientX;
  }

  function handleNeighbourhoodTouchEnd(e) {
    if (neighbourhoodTouchX.current === null) return;
    const diff = neighbourhoodTouchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSpot() : prevSpot();
    }
    neighbourhoodTouchX.current = null;
  }

  return (
    <div className="thespot-wrapper">
    <div className="thespot-page">

      {/* HERO */}
      <div className="thespot-hero">
        {cafe.photo_url
          ? <img src={cafe.photo_url} alt={cafe.name} className="thespot-hero__img" />
          : <div className="thespot-hero__placeholder" />
        }
        <HomeButton />
        <img src={rectTop} alt="" className="thespot-hero__rect-top" />
      </div>

      {/* CAFÉ INFO */}
      <div className="thespot-info">
        <div className="thespot-info__name-row">
          <h1 className="thespot-info__name">{cafe.name}</h1>
          <img src={titleCafeLine} alt="" className="thespot-info__name-line" />
        </div>
        <div className="thespot-info__status-row">
          <div className="thespot-info__status">
            <span className={`thespot-status ${status && !status.isOpen ? "thespot-status--closed" : "thespot-status--open"}`} onClick={() => setShowHoursPopup(true)}>
              {status ? (status.isOpen ? "Open" : "Closed") : "Open"}
            </span>
            <span className="thespot-status__square" />
            <span className="thespot-status thespot-status--open" onClick={() => setShowHoursPopup(true)}>Not busy</span>
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
        <img src={rectSide} alt="" className="thespot-info__rect-side" />
        <img src={pinkPixels} alt="" className="thespot-quote__pixels" />
        <img src={sparkOrange} alt="" className="thespot-quote__spark" />
        <p className="thespot-quote__text">
          Every great spot <span>deserves a great beer!</span>
        </p>
        <img src={greenLine} alt="" className="thespot-quote__line" />
        <img src={beerImg} alt={cafe.beer_name || "beer"} className="thespot-quote__beer" />
      </div>

      {/* VIBE / BEER */}
      <div className="thespot-vibe">
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
          <img src={rectSide} alt="" className="thespot-stories__rect" />
          <h2 className="thespot-stories__title">Stories &<br />recommendations</h2>

          <div
            className="thespot-story__carousel"
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) {
                if (diff > 0) setRecIndex((i) => (i + 1) % recs.length);
                else setRecIndex((i) => (i - 1 + recs.length) % recs.length);
              }
              touchStartX.current = null;
            }}
          >
            <div
              className="thespot-story__track"
              style={{ transform: `translateX(calc(-${recIndex} * 85%))` }}
            >
              {recs.map((r, i) => (
                <div key={r.id} className="thespot-story-card">
                  <span className="thespot-story__author">
                    {r.name} ({r.age}y) • {r.city}
                  </span>
                  <p className="thespot-story__text">{r.description}</p>
                </div>
              ))}
            </div>
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

          <div className="thespot-neighbourhood__card" onTouchStart={handleNeighbourhoodTouchStart} onTouchEnd={handleNeighbourhoodTouchEnd}>
            {/* PHOTO */}
            <div className="thespot-neighbourhood__photo-wrap">
              {currentSpot.photo_url && currentSpot.photo_url !== "placeholder.jpg"
                ? <img src={currentSpot.photo_url} alt={currentSpot.name} className="thespot-neighbourhood__photo" />
                : <div className="thespot-neighbourhood__photo-placeholder" />
              }
              <span className="thespot-neighbourhood__walk">
                <img src={walkIcon} alt="" className="thespot-neighbourhood__walk-icon" />
                {currentSpot.walk_minutes} min
              </span>
            </div>

            {/* INFO — beige bg */}
            <div className="thespot-neighbourhood__info">
              <img src={areaBeige} alt="" className="thespot-neighbourhood__info-bg" />

              <span className="thespot-neighbourhood__counter">
                Spot {spotIndex + 1} out of {spots.length}
              </span>
              <h3 className="thespot-neighbourhood__name">{currentSpot.name}</h3>

              {currentSpot.address && (
                <a
                  className="thespot-neighbourhood__address"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentSpot.name + ' ' + currentSpot.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={locationPin} alt="" className="thespot-neighbourhood__pin" />
                  {currentSpot.address}
                </a>
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
        </div>
      )}

    </div>

    {/* HOURS POPUP */}
    {showHoursPopup && (
      <div className="hours-overlay" onClick={() => setShowHoursPopup(false)}>
        <div className="hours-popup" onClick={(e) => e.stopPropagation()}>
          <img src={popupBg} alt="" className="hours-popup__bg" />
          <button className="hours-popup__close" onClick={() => setShowHoursPopup(false)}>
            <img src={closeIcon} alt="close" className="hours-popup__close-icon" />
          </button>

          <div className="hours-popup__content">
            <h2 className="hours-popup__title">When it's <span>brewing</span></h2>

            <div className="hours-popup__schedule">
              <img src={popupLine} alt="" className="hours-popup__line" />
              <div className="hours-popup__days">
                {["mon","tue","wed","thu","fri","sat","sun"].map((day) => {
                  const label = day.charAt(0).toUpperCase() + day.slice(1);
                  const range = cafe.opening_hours?.[day];
                  const formatTime = (t) => {
                    const [h, m] = t.split(":").map(Number);
                    const period = h >= 12 ? "PM" : "AM";
                    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    return `${h12}:${m.toString().padStart(2,"0")}${period}`;
                  };
                  const displayRange = range
                    ? (() => {
                        const [open, close] = range.split("-");
                        return `${formatTime(open)} – ${formatTime(close)}`;
                      })()
                    : "Closed";
                  return (
                    <div key={day} className="hours-popup__day-row">
                      <span className="hours-popup__day-name">{label}</span>
                      <span className="hours-popup__day-hours">{displayRange}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hours-popup__busy">
              <h3 className="hours-popup__busy-title"><span>Unpopular</span> times</h3>
              <div className="hours-popup__chart">
                <div className="hours-popup__chart-days">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                    <span
                      key={d}
                      className={`hours-popup__chart-day${d === chartDay ? " hours-popup__chart-day--active" : ""}`}
                      onClick={() => setChartDay(d)}
                    >{d}</span>
                  ))}
                </div>
                <div className="hours-popup__bars">
                  {getAdjustedBars().map((h, i) => (
                    <div key={i} className="hours-popup__bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="hours-popup__chart-times">
                  {["10am","1pm","4pm","7pm","10pm"].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="thespot-footer">
      <Footer hideShare />
    </div>
    </div>
  );
}
