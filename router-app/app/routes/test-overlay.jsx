import { useState, useEffect } from "react";
import beerImg from "../assets/images/beer-animation.png";
import coasterImg from "../assets/images/coaster-animation.png";
import "./home.css";

export default function TestOverlay() {
  const [overlayPhase, setOverlayPhase] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setOverlayPhase(2), 900);
    const t2 = setTimeout(() => setOverlayPhase(4), 1800);
    const t3 = setTimeout(() => setOverlayPhase(0), 2700);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--beige)" }}>
      {overlayPhase > 0 && (
        <div className="added-overlay" aria-hidden="true">
          {overlayPhase <= 2 && (
            <img
              src={beerImg}
              alt=""
              className={`added-overlay__beer${overlayPhase === 2 ? " added-overlay__beer--exit" : " added-overlay__beer--enter"}`}
            />
          )}
          <div
            className={
              "added-overlay__coaster-group" +
              (overlayPhase === 1 ? " added-overlay__coaster-group--enter" : "") +
              (overlayPhase === 4 ? " added-overlay__coaster-group--exit" : "")
            }
          >
            <img src={coasterImg} alt="" className="added-overlay__coaster-img" />
          </div>
        </div>
      )}
    </div>
  );
}
