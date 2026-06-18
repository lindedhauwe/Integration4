import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import "./storytelling.css";

// ── Story layer assets ──────────────────────────────────────────────────────
import steenImg from "../assets/scrollytelling/story/steen.png"
import hillsImg from "../assets/scrollytelling/story/hills.svg";
import sunImg from "../assets/scrollytelling/story/sun.svg";
import waterImg from "../assets/scrollytelling/story/water.svg";
import smallWaterImg from "../assets/scrollytelling/story/small-water-part.svg";
import roadImg from "../assets/scrollytelling/story/road.svg";
import pubsImg from "../assets/scrollytelling/story/pubs.png";
import marketImg from "../assets/scrollytelling/story/market.png";
import masImg from "../assets/scrollytelling/story/mas.png";
import havenhuisImg from "../assets/scrollytelling/story/havenhuis.png";
import lightsImg from "../assets/scrollytelling/story/lights.png";
import langeWapperImg from "../assets/scrollytelling/story/lange-wapper.svg";
import coupleImg from "../assets/scrollytelling/story/couple-steen.png";
import coupleBushImg from "../assets/scrollytelling/story/couple-bush.png";
import duoStandingImg from "../assets/scrollytelling/story/duo-standing.png";
import barrelGuysImg from "../assets/scrollytelling/story/barrel-guys.png";
import barrelImg from "../assets/scrollytelling/story/barrel.png"
import banjoPlayerImg from "../assets/scrollytelling/story/banjo-player.png";
import contrabasImg from "../assets/scrollytelling/story/contrabas-player.png";
import table01Img from "../assets/scrollytelling/story/table-cafe01.png";
import table02Img from "../assets/scrollytelling/story/table-cafe02.png";
import table03Img from "../assets/scrollytelling/story/table-cafe03.png";
import pigeons01Img from "../assets/scrollytelling/story/pigeons01.png";
import pigeons02Img from "../assets/scrollytelling/story/pigeons02.png";
import seagullImg from "../assets/scrollytelling/story/seagull01.png";
import seagullFlyingImg from "../assets/scrollytelling/story/seagull02.png";
import boatImg from "../assets/scrollytelling/story/lange-wapper-boat.png";
import tree01Img from "../assets/scrollytelling/story/tree01.png";
import tree02Img from "../assets/scrollytelling/story/tree02.png";
import clickImg from "../assets/scrollytelling/story/click.svg";
import mariaGlowImg from "../assets/scrollytelling/story/maria-glow.png"
import beerBottleImg from "../assets/scrollytelling/story/beer-bottle.png"

// ── Checkpoint / interactive assets ────────────────────────────────────────
import beerImg from "../assets/scrollytelling/story/beer.png";
import mariaImg from "../assets/scrollytelling/story/maria.png";
import silviusImg from "../assets/scrollytelling/story/silvius.png";

// ── Popup assets ────────────────────────────────────────────────────────────
import beerCoasterImg from "../assets/scrollytelling/pop-ups/beer-coaster.png";
import polaroidsImg from "../assets/scrollytelling/pop-ups/polaroids.png";
import routeImg from "../assets/scrollytelling/pop-ups/route.png";
import mapImg from "../assets/scrollytelling/pop-ups/kaart.png";
import bigCrossImg from "../assets/scrollytelling/pop-ups/big-cross.svg";
import greenSquareImg from "../assets/scrollytelling/pop-ups/green-square.svg";
import phoneDemoFillImg from "../assets/scrollytelling/pop-ups/phone-demo-fill.png";
import phoneDemoEmptyImg from "../assets/scrollytelling/pop-ups/phone-demo-empty.png"
import buttonSpaceImg from "../assets/scrollytelling/pop-ups/button-space.svg"

import fullFrameImg from "../assets/scrollytelling/story/full-frame.jpg";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// ── Total track width ───────────────────────────────────────────────────────
const TRACK_WIDTH = 4300;

// ── Gate positions
const GATES = [
    { id: "beer", x: 930 },
    { id: "maria", x: 2500 },
    { id: "silvius", x: 3100 },
];

// ── Modal content per gate ──────────────────────────────────────────────────
const MODAL_CONTENT = {
    beer: {
        title:
            (
                <>
                    <span>Tap in</span> & discover an Antwerp bar
                </>
            ),
        body: "You will get personal recommendations from Antwerp locals and visitors.",
    },
    maria: {
        title:
            (
                <>
                    Collect & build your <span>bar crawl!</span>
                </>
            ),
        body: "Watch your pub crawl grow with every bar you discover and share your route with fellow explorers.",
    },
    silvius: {
        title: (
            <>
                Tell us about <span>your own experience!</span>
            </>
        ),
        body: "Your story can be shared with others who are interested!",
    },
};

const STORYTELLING_TEXT = [
    "You’re drinking a beer from Antwerp",
    "A beer that carries centuries of tales",
    "Leaving stains of stories on coasters in bars",
    "Stories that know the best trail around Antwerp",
    "Bar by bar, tap by tap",
    "Until a trail became a story of its own",
    "Some keep it as a memory, others pass it on"
];

const TEXT_HIDE_AT = 0.80;

const TEXT_STEPS = [
    { progress: 0.00, index: 0 },
    { progress: 0.10, index: 1 },
    { progress: 0.21, index: 2 },
    { progress: 0.37, index: 3 },
    { progress: 0.51, index: 4 },
    { progress: 0.62, index: 5 },
    { progress: 0.75, index: 6 },
];

export default function Storytelling() {
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const trackRef = useRef(null);
    const lockedScrollPos = useRef(null);
    const unlockedGates = useRef(new Set());
    const exitTriggered = useRef(false);
    const [exitActive, setExitActive] = useState(false);

    const langeWapperBarrelRef = useRef(null);
    const langeWapperAnimated = useRef(false);
    const langeWapperSway = useRef(null);

    const langeWapperTableRef = useRef(null);
    const langeWapperTableAnimated = useRef(false);
    const langeWapperTableSway = useRef(null);

    const beerBottleRef = useRef(null);
    const beerPathRef = useRef(null);
    const mainTweenRef = useRef(null);
    const bottleTweenRef = useRef(null);

    const mariaGlowRef1 = useRef(null);
    const mariaGlowRef2 = useRef(null);
    const mariaGlowRef3 = useRef(null);
    const mariaGlow1Animated = useRef(false);
    const mariaGlow2Animated = useRef(false);
    const mariaGlow3Animated = useRef(false);

    const [activeModal, setActiveModal] = useState(null);
    const [mariaVisited, setMariaVisited] = useState(false);
    const [storyTextIndex, setStoryTextIndex] = useState(0);
    const [captionVisible, setCaptionVisible] = useState(true);
    const lastTextIndexRef = useRef(-1);

    // ── Horizontal scroll + gate enforcement ─────────────────────────────────
    useEffect(() => {
        const wrapper = wrapperRef.current;
        const track = trackRef.current;
        const langeWapperBarrel = langeWapperBarrelRef.current;
        const langeWapperTable = langeWapperTableRef.current;
        const totalTravel = TRACK_WIDTH - window.innerWidth;
        gsap.set(langeWapperBarrel, {
            x: 30,
            y: 0,
            rotate: -10,
            transformOrigin: "bottom center"
        });

        gsap.set(langeWapperTable, {
            x: 0,
            y: 80,
            rotate: 15,
            opacity: 0,
            transformOrigin: "bottom center"
        });

        gsap.set([mariaGlowRef1.current, mariaGlowRef2.current, mariaGlowRef3.current], { opacity: 0 });

        bottleTweenRef.current = gsap.to(beerBottleRef.current, {
            motionPath: {
                path: beerPathRef.current,
                align: beerPathRef.current,
                autoRotate: true,
                alignOrigin: [0.5, 0.5],
                start: 0.02,
                end: 0.96,
            },
            duration: 1,
            ease: "none",
            paused: true,
        });

        mainTweenRef.current = gsap.to(track, {
            x: -totalTravel,
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                start: "top top",
                end: () => `+=${totalTravel}`,
                pin: true,
                scrub: 0.9,
                anticipatePin: 1,
                onUpdate(self) {
                    if (!langeWapperAnimated.current && self.progress >= 0.09) {
                        langeWapperAnimated.current = true;
                        gsap.to(langeWapperBarrel, {
                            x: 9,
                            y: -3,
                            rotate: -20,
                            opacity: 1,
                            duration: 0.85,
                            ease: "back.out(1.7)",
                            onComplete() {
                                langeWapperSway.current = gsap.timeline({
                                    repeat: -1
                                });
                                langeWapperSway.current
                                    .to({}, { duration: 1 })
                                    .to(langeWapperBarrel, { rotate: 0, x: 28, y: 2, duration: 0.9, ease: "back.inOut(0.5)" })
                                    .to({}, { duration: 1 })
                                    .to(langeWapperBarrel, { rotate: -20, x: 9, y: -3, duration: 1.5, ease: "back.out(1.4)" })
                            },
                        });
                    }

                    if (!langeWapperTableAnimated.current && self.progress >= 0.46) {
                        langeWapperTableAnimated.current = true;
                        gsap.to(langeWapperTable, {
                            x: 6,
                            y: 0,
                            rotate: -7,
                            opacity: 1,
                            duration: 0.85,
                            ease: "back.out(1.7)",
                            onComplete() {
                                langeWapperTableSway.current = gsap.timeline({ repeat: -1 });
                                langeWapperTableSway.current
                                    .to({}, { duration: 1.2 })
                                    .to(langeWapperTable, { rotate: 10, x: 12, y: 4, duration: 1, ease: "back.inOut(0.5)" })
                                    .to({}, { duration: 1.2 })
                                    .to(langeWapperTable, { rotate: -7, x: 6, y: 0, duration: 1.5, ease: "back.out(1.4)" });
                            },
                        });
                    }

                    if (!mariaGlow1Animated.current && self.progress >= 0.40) {
                        mariaGlow1Animated.current = true;
                        gsap.to(mariaGlowRef1.current, {
                            opacity: 1, duration: 1.5, ease: "power2.inOut",
                            onComplete() {
                                gsap.to(mariaGlowRef1.current, { opacity: 0.55, duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true });
                            },
                        });
                    }

                    if (!mariaGlow2Animated.current && self.progress >= 0.47) {
                        mariaGlow2Animated.current = true;
                        gsap.to(mariaGlowRef2.current, {
                            opacity: 1, duration: 1.5, ease: "power2.inOut",
                            onComplete() {
                                gsap.to(mariaGlowRef2.current, { opacity: 0.55, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true });
                            },
                        });
                    }

                    if (!mariaGlow3Animated.current && self.progress >= 0.52) {
                        mariaGlow3Animated.current = true;
                        gsap.to(mariaGlowRef3.current, {
                            opacity: 1, duration: 1.5, ease: "power2.inOut",
                            onComplete() {
                                gsap.to(mariaGlowRef3.current, { opacity: 0.55, duration: 1.6, ease: "sine.inOut", repeat: -1, yoyo: true });
                            },
                        });
                    }

                    bottleTweenRef.current?.progress(self.progress);

                    const newIdx = [...TEXT_STEPS].reverse().find(s => self.progress >= s.progress)?.index ?? 0;
                    if (newIdx !== lastTextIndexRef.current) {
                        lastTextIndexRef.current = newIdx;
                        setStoryTextIndex(newIdx);
                    }
                    setCaptionVisible(self.progress < TEXT_HIDE_AT);

                    if (!exitTriggered.current && self.progress >= 0.98) {
                        exitTriggered.current = true;
                        setExitActive(true);
                        setTimeout(() => {
                            ScrollTrigger.getAll().forEach(st => st.kill());
                            mainTweenRef.current?.kill();
                            bottleTweenRef.current?.kill();
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => navigate("/loadingrecommendation"));
                            });
                        }, 800);
                    }

                    if (lockedScrollPos.current !== null) return;

                    const currentX = self.progress * totalTravel;
                    const gate = GATES.find(
                        (g) => !unlockedGates.current.has(g.id) && currentX >= g.x
                    );
                    if (gate) {
                        const targetProgress = gate.x / totalTravel;
                        lockedScrollPos.current =
                            self.start + targetProgress * (self.end - self.start);
                    }
                },
            },
        });

        const onScroll = () => {
            if (lockedScrollPos.current !== null) {
                window.scrollTo(0, lockedScrollPos.current);
            }
        };
        window.addEventListener("scroll", onScroll);

        return () => {
            mainTweenRef.current?.scrollTrigger?.kill();
            mainTweenRef.current?.kill();
            bottleTweenRef.current?.kill();
            window.removeEventListener("scroll", onScroll);
            langeWapperSway.current?.kill();
            langeWapperTableSway.current?.kill();
        };
    }, []);

    // ── Touch swipe → horizontal scroll (with momentum) ──────────────────────
    useEffect(() => {
        let lastX = 0;
        let lastY = 0;
        let velocity = 0;
        let directionLocked = false;
        let isHorizontal = false;
        let rafId = null;

        const stopMomentum = () => {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        };

        const applyMomentum = () => {
            if (Math.abs(velocity) < 0.5) { rafId = null; return; }
            window.scrollBy(0, velocity);
            velocity *= 0.9;
            rafId = requestAnimationFrame(applyMomentum);
        };

        const onTouchStart = (e) => {
            stopMomentum();
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
            velocity = 0;
            directionLocked = false;
            isHorizontal = false;
        };

        const onTouchMove = (e) => {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const dx = lastX - currentX;
            const dy = lastY - currentY;

            if (!directionLocked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
                directionLocked = true;
                isHorizontal = Math.abs(dx) > Math.abs(dy);
            }

            if (isHorizontal) {
                e.preventDefault();
                velocity = dx;
                window.scrollBy(0, dx);
                lastX = currentX;
                lastY = currentY;
            }
        };

        const onTouchEnd = () => {
            if (isHorizontal) rafId = requestAnimationFrame(applyMomentum);
        };

        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: true });

        return () => {
            stopMomentum();
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, []);

    // ── Modal handlers ────────────────────────────────────────────────────────
    const openModal = (id) => setActiveModal(id);

    const closeModal = () => {
        unlockedGates.current.add(activeModal);
        lockedScrollPos.current = null;
        setActiveModal(null);
    };

    const modal = activeModal ? MODAL_CONTENT[activeModal] : null;

    const handleSkip = () => {
        exitTriggered.current = true;
        ScrollTrigger.getAll().forEach(st => st.kill());
        mainTweenRef.current?.kill();
        bottleTweenRef.current?.kill();
        langeWapperSway.current?.kill();
        langeWapperTableSway.current?.kill();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => navigate("/loadingrecommendation"));
        });
    };

    return (
        <>
            <button className="st-skip" onClick={handleSkip}>skip</button>
            {/* ── Pinned horizontal scroll wrapper ── */}
            <div ref={wrapperRef} className="st-wrapper">

                {/* ── 5300px-wide track ── */}
                <div ref={trackRef} className="st-track">
                    <h1 className="st-title">Antwerp</h1>

                    {/* ════════════════════════════════════════════════════════════════
              BUILDINGS & STRUCTURES LAYER
              ════════════════════════════════════════════════════════════════ */}

                    <img src={steenImg} className="asset steen" alt="" draggable="false" />
                    <div className="asset pubs">
                        <img src={pubsImg} className="buildings" alt="" draggable="false" />
                        <img ref={mariaGlowRef1} src={mariaGlowImg} className="asset maria-glow maria-glow--1" alt=""></img>
                        <img ref={mariaGlowRef2} src={mariaGlowImg} className="asset maria-glow maria-glow--2" alt=""></img>
                        <img ref={mariaGlowRef3} src={mariaGlowImg} className="asset maria-glow maria-glow--3" alt=""></img>
                    </div>
                    <img src={marketImg} className="asset market" alt="" draggable="false" />
                    <img src={masImg} className="asset mas" alt="" draggable="false" />
                    <img src={havenhuisImg} className="asset havenhuis" alt="" draggable="false" />
                    <img src={lightsImg} className="asset lights" alt="" draggable="false" />
                    <img ref={langeWapperBarrelRef} src={langeWapperImg} className="asset lange-wapper lange-wapper--barrel" alt="" draggable="false" />
                    <img ref={langeWapperTableRef} src={langeWapperImg} className="asset lange-wapper lange-wapper--table" alt="" draggable="false" />

                    {/* ════════════════════════════════════════════════════════════════
              CHARACTERS & PROPS LAYER
              ════════════════════════════════════════════════════════════════ */}
                    <img src={coupleImg} className="asset couple-steen" alt="" draggable="false" />
                    <img src={coupleBushImg} className="asset couple-bush" alt="" draggable="false" />
                    <img src={duoStandingImg} className="asset duo-standing" alt="" draggable="false" />
                    <img src={barrelGuysImg} className="asset barrel-guys" alt="" draggable="false" />
                    <img src={barrelImg} className="asset barrel" alt="" draggable="false" />
                    <img src={banjoPlayerImg} className="asset banjo-player" alt="" draggable="false" />
                    <img src={contrabasImg} className="asset contrabas-player" alt="" draggable="false" />
                    <img src={table01Img} className="asset table-cafe-01" alt="" draggable="false" />
                    <img src={table02Img} className="asset table-cafe-02" alt="" draggable="false" />
                    <img src={table03Img} className="asset table-cafe-03" alt="" draggable="false" />

                    {/* ════════════════════════════════════════════════════════════════
              AMBIENT ANIMATION LAYER
              ════════════════════════════════════════════════════════════════ */}
                    <img src={pigeons01Img} className="asset bird bird--01" alt="" draggable="false" />
                    <img src={pigeons02Img} className="asset bird bird--02" alt="" draggable="false" />
                    <img src={seagullImg} className="asset seagull--01" alt="" draggable="false" />
                    <img src={seagullFlyingImg} className="asset seagull--02" alt="" draggable="false" />
                    <img src={boatImg} className="asset boat" alt="" draggable="false" />
                    <img src={tree01Img} className="asset tree tree--01" alt="" draggable="false" />
                    <img src={tree02Img} className="asset tree tree--02" alt="" draggable="false" />
                    <img src={tree02Img} className="asset tree tree--03" alt="" draggable="false" />

                    {/* ════════════════════════════════════════════════════════════════
              CHECKPOINT LAYER
              ════════════════════════════════════════════════════════════════ */}
                    <button
                        className="checkpoint checkpoint--beer"
                        onClick={() => openModal("beer")}
                        aria-label="Interact: beer mug"
                    >
                        <img src={clickImg} className="click-hint" alt="" />
                        <img src={beerImg} className="image" alt="Beer mug" />
                    </button>

                    <button
                        className="checkpoint checkpoint--maria"
                        onClick={() => { openModal("maria"); setMariaVisited(true); }}
                        aria-label="Interact: Maria statue"
                    >
                        <img src={clickImg} className="click-hint" alt="" />
                        <img src={mariaImg} className="image" alt="Maria statue" />
                        <img src={mariaGlowImg} className={`asset maria-glow maria-glow--4${mariaVisited ? " maria-glow--visible" : ""}`} alt="" />
                    </button>

                    <button
                        className="checkpoint checkpoint--silvius"
                        onClick={() => openModal("silvius")}
                        aria-label="Interact: Silvius Brabo"
                    >
                        <img src={clickImg} className="click-hint" alt="" />
                        <img src={silviusImg} className="image" alt="Silvius" />
                    </button>

                    {/* SVG path for the beer bottle to follow */}
                    <svg
                        className="beer-bottle-path"
                        viewBox="0 0 5213 260"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path ref={beerPathRef} d="M0 160.718C140 160.885 431.7 162.718 478.5 168.718C537 176.218 903.689 181.438 1035.5 110.218C1221.5 9.71819 1505 -15.783 1685.5 9.71699C1866 35.217 2239 167.218 2439 156.218C2639 145.218 2889.83 156.218 3069.5 131.718C3245.5 107.718 3526.74 184.216 3660.5 131.718C3846.5 58.7179 3905.5 132.218 4012.5 210.218C4119.5 288.218 4283 223.052 4387 213.769C4491 204.486 4507 210.944 4537.5 213.769C4568 216.594 4641.5 216.998 4676 210.54C4710.5 204.083 4778.5 207.312 4805.5 210.54C4832.5 213.769 4908 219.823 4959 210.54C5010 201.258 5060 207.312 5093 210.54C5126 213.769 5167 240.218 5213 215.718" stroke="black" />
                    </svg>

                    {/* Beer bottle — follows path via MotionPath */}
                    <img
                        ref={beerBottleRef}
                        src={beerBottleImg}
                        className="beer-bottle-follower"
                        alt=""
                        draggable="false"
                    />


                </div>{/* end st-track */}

            </div>{/* end st-wrapper */}

            {/* ── Fixed storytelling caption ─────────────────────────────────────── */}
            <div className={`story-caption${captionVisible ? "" : " story-caption--hidden"}`}>
                <p key={storyTextIndex} className="story-caption__text">
                    {STORYTELLING_TEXT[storyTextIndex]}
                </p>
            </div>

            {/* ── Exit transition overlay ───────────────────────────────────────── */}
            <div className={`st-exit-overlay${exitActive ? " st-exit-overlay--active" : ""}`} />

            {/* ── Modal overlay ─────────────────────────────────────────────────── */}
            {modal && (
                <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeModal}>
                    <div className={`modal ${activeModal === "maria" ? "modal--maria" : ""}`} onClick={(e) => e.stopPropagation()}>

                        <div className="modal__media">
                            {activeModal === "beer" && (
                                <>
                                    <img src={beerCoasterImg} className="modal__img modal__img--coaster" alt="" />
                                    <div className="modal__phones">
                                        <img src={phoneDemoFillImg} className="modal__phone modal__phone--fill" alt="" />
                                        <img src={phoneDemoEmptyImg} className="modal__phone modal__phone--empty" alt="" />
                                    </div>
                                </>
                            )}

                            {activeModal === "maria" && (
                                <>
                                    <img src={routeImg} className="modal__img modal__img--map" alt="" />
                                </>
                            )}

                            {activeModal === "silvius" && (
                                <>
                                    <img src={polaroidsImg} className="modal__img modal__img--polaroids" alt="" />
                                </>
                            )}
                        </div>

                        <div className="modal__body">
                            <h2 className="modal__title">{modal.title}</h2>
                            <p className="modal__text">{modal.body}</p>
                            <button className="modal__close" onClick={closeModal}>
                                <img src={buttonSpaceImg} alt="" className="close-bg" />
                                <img src={bigCrossImg} alt="sluit menu" className="close-icon" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
