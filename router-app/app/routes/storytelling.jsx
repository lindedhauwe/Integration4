import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./storytelling.css";
import bgNav from "~/assets/bg-nav.svg";
import closeIcon from "~/assets/close.svg";

// ── Story layer assets ──────────────────────────────────────────────────────
import steenImg from "../assets/scrollytelling/story/steen.png"
import hillsImg from "../assets/scrollytelling/story/hills.svg";
import sunImg from "../assets/scrollytelling/story/sun.svg";
import waterImg from "../assets/scrollytelling/story/water.svg";
import smallWaterImg from "../assets/scrollytelling/story/small-water-part.svg";
import roadImg from "../assets/scrollytelling/story/road.svg";
import buildingsImg from "../assets/scrollytelling/story/buildings.png";
import pubsImg from "../assets/scrollytelling/story/Pubs.png";
import marketImg from "../assets/scrollytelling/story/market.png";
import masImg from "../assets/scrollytelling/story/mas.png";
import havenhuisImg from "../assets/scrollytelling/story/havenhuis.png";
import lightsImg from "../assets/scrollytelling/story/lights.png";
import langeWapperImg from "../assets/scrollytelling/story/lange-wapper.svg";
import coupleImg from "../assets/scrollytelling/story/couple-steen.png";
import duoStandingImg from "../assets/scrollytelling/story/duo-standing.png";
import barrelGuysImg from "../assets/scrollytelling/story/barrel-guys.png";
import banjoPlayerImg from "../assets/scrollytelling/story/banjo-player.png";
import contrabasImg from "../assets/scrollytelling/story/contrabas-player.png";
import table01Img from "../assets/scrollytelling/story/table-cafe01.png";
import table02Img from "../assets/scrollytelling/story/table-cafe02.png";
import table03Img from "../assets/scrollytelling/story/table-cafe03.png";
import rollingBeerImg from "../assets/scrollytelling/story/rolling beer bottle.png";
import pigeons01Img from "../assets/scrollytelling/story/pigeons01.png";
import pigeons02Img from "../assets/scrollytelling/story/pigeons02.png";
import seagullImg from "../assets/scrollytelling/story/seagull01.png";
import boatImg from "../assets/scrollytelling/story/lange-wapper-boat.png";
import tree01Img from "../assets/scrollytelling/story/tree01.png";
import tree02Img from "../assets/scrollytelling/story/tree02.png";
import clickImg from "../assets/scrollytelling/story/click.svg";

// ── Checkpoint / interactive assets ────────────────────────────────────────
import beerImg from "../assets/scrollytelling/story/beer.png";
import mariaImg from "../assets/scrollytelling/story/maria.png";
import silviusImg from "../assets/scrollytelling/story/silvius.png";

// ── Popup assets ────────────────────────────────────────────────────────────
import beerCoasterImg from "../assets/scrollytelling/pop-ups/beer-coaster.png";
import polaroidsImg from "../assets/scrollytelling/pop-ups/polaroids.png";
import mapImg from "../assets/scrollytelling/pop-ups/kaart.png";
import bigCrossImg from "../assets/scrollytelling/pop-ups/big-cross.svg";
import greenSquareImg from "../assets/scrollytelling/pop-ups/green-square.svg";
import phoneDemoFillImg from "../assets/scrollytelling/pop-ups/phone-demo-fill.png";

gsap.registerPlugin(ScrollTrigger);

// ── Total track width ───────────────────────────────────────────────────────
const TRACK_WIDTH = 5300;

// ── Gate positions (x = pixels along the horizontal track where scroll locks)
// Adjust these values to match the visual position of each interactive object.
const GATES = [
    { id: "beer", x: 1380 },
    { id: "maria", x: 2980 },
    { id: "silvius", x: 4480 },
];

// ── Modal content per gate ──────────────────────────────────────────────────
// Replace body text and images with final copy.
const MODAL_CONTENT = {
    beer: {
        title:
            (
                <>
                    <span>Tap in</span> & discover an Antwerp bar
                </>
            ),
        body: "You will get personal recommendations from Antwerp locals and visitors.",
        image: beerCoasterImg,
    },
    silvius: {
        title:
            (
                <>
                    Collect & build your <span>bar crawl!</span>,
                </>
            ),
        body: "Watch your pub crawl grow with every bar you discover and share your route with fellow explorers.",
        image: polaroidsImg,
    },
    maria: {
        title: (
            <>
                Tell us about <span>your own experience!</span>
            </>
        ),
        body: "Your story can be shared with others who are interested!",
        image: mapImg,
    },
};

export default function Storytelling() {
    const wrapperRef = useRef(null);
    const trackRef = useRef(null);
    const lockedScrollPos = useRef(null);
    const unlockedGates = useRef(new Set());

    const [activeModal, setActiveModal] = useState(null);

    // ── Horizontal scroll + gate enforcement ─────────────────────────────────
    useEffect(() => {
        const wrapper = wrapperRef.current;
        const track = trackRef.current;
        const totalTravel = TRACK_WIDTH - window.innerWidth;

        const tween = gsap.to(track, {
            x: -totalTravel,
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                start: "top top",
                end: () => `+=${totalTravel}`,
                pin: true,
                scrub: true,
                anticipatePin: 1,
                onUpdate(self) {
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

        // Enforce the lock on every scroll event
        const onScroll = () => {
            if (lockedScrollPos.current !== null) {
                window.scrollTo(0, lockedScrollPos.current);
            }
        };
        window.addEventListener("scroll", onScroll);

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    // ── Ambient animations ────────────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Birds — float up/down at slightly different rhythms
            gsap.utils.toArray(".bird").forEach((el, i) => {
                gsap.to(el, {
                    y: i % 2 === 0 ? -16 : -10,
                    duration: 2 + i * 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            });

            // Boat — gentle bob + slight tilt
            gsap.to(".boat", {
                y: 8,
                rotation: 1.5,
                duration: 3.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Trees — sway from base
            gsap.utils.toArray(".tree").forEach((el, i) => {
                gsap.to(el, {
                    rotation: i % 2 === 0 ? 2.5 : -2.5,
                    transformOrigin: "50% 100%",
                    duration: 2.8 + i * 0.4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            });
        }, trackRef);

        return () => ctx.revert();
    }, []);

    // ── Modal handlers ────────────────────────────────────────────────────────
    const openModal = (id) => setActiveModal(id);

    const closeModal = () => {
        unlockedGates.current.add(activeModal);
        lockedScrollPos.current = null;
        setActiveModal(null);
    };

    const modal = activeModal ? MODAL_CONTENT[activeModal] : null;

    return (
        <>
            {/* ── Pinned horizontal scroll wrapper ── */}
            <div ref={wrapperRef} className="st-wrapper">

                {/* ── 5300px-wide track ── */}
                <div ref={trackRef} className="st-track">

                    {/* ════════════════════════════════════════════════════════════════
              BACKGROUND LAYER  (z-index 1–3)
              Hills, sky elements, water, road
              ════════════════════════════════════════════════════════════════ */}
                    <img src={hillsImg} className="asset hills" alt="" draggable="false" />
                    <img src={sunImg} className="asset sun" alt="" draggable="false" />
                    <img src={waterImg} className="asset water" alt="" draggable="false" />
                    <img src={smallWaterImg} className="asset small-water" alt="" draggable="false" />
                    <img src={roadImg} className="asset road" alt="" draggable="false" />

                    {/* ════════════════════════════════════════════════════════════════
              BUILDINGS & STRUCTURES LAYER  (z-index 5)
              ════════════════════════════════════════════════════════════════ */}
                    <img src={steenImg} className="asset steen" alt="" draggable="false" />
                    <img src={buildingsImg} className="asset buildings" alt="" draggable="false" />
                    <img src={pubsImg} className="asset pubs" alt="" draggable="false" />
                    <img src={marketImg} className="asset market" alt="" draggable="false" />
                    <img src={masImg} className="asset mas" alt="" draggable="false" />
                    <img src={havenhuisImg} className="asset havenhuis" alt="" draggable="false" />
                    <img src={lightsImg} className="asset lights" alt="" draggable="false" />
                    <img src={langeWapperImg} className="asset lange-wapper" alt="" draggable="false" />

                    {/* ════════════════════════════════════════════════════════════════
              CHARACTERS & PROPS LAYER  (z-index 7)
              ════════════════════════════════════════════════════════════════ */}
                    <img src={coupleImg} className="asset couple-steen" alt="" draggable="false" />
                    <img src={duoStandingImg} className="asset duo-standing" alt="" draggable="false" />
                    <img src={barrelGuysImg} className="asset barrel-guys" alt="" draggable="false" />
                    <img src={banjoPlayerImg} className="asset banjo-player" alt="" draggable="false" />
                    <img src={contrabasImg} className="asset contrabas-player" alt="" draggable="false" />
                    <img src={table01Img} className="asset table-cafe-01" alt="" draggable="false" />
                    <img src={table02Img} className="asset table-cafe-02" alt="" draggable="false" />
                    <img src={table03Img} className="asset table-cafe-03" alt="" draggable="false" />
                    <img src={rollingBeerImg} className="asset rolling-beer" alt="" draggable="false" />

                    {/* ════════════════════════════════════════════════════════════════
              AMBIENT ANIMATION LAYER  (z-index 8)
              Birds, boat, trees — animated via GSAP in useEffect
              ════════════════════════════════════════════════════════════════ */}
                    <img src={pigeons01Img} className="asset bird bird--01" alt="" draggable="false" />
                    <img src={pigeons02Img} className="asset bird bird--02" alt="" draggable="false" />
                    <img src={seagullImg} className="asset bird bird--03" alt="" draggable="false" />
                    <img src={boatImg} className="asset boat" alt="" draggable="false" />
                    <img src={tree01Img} className="asset tree tree--01" alt="" draggable="false" />
                    <img src={tree02Img} className="asset tree tree--02" alt="" draggable="false" />

                    {/* ════════════════════════════════════════════════════════════════
              CHECKPOINT LAYER  (z-index 10)
              Each button locks scroll on approach; modal unlocks it.
              To add a new checkpoint:
                1. Add an entry to GATES with { id, x }
                2. Add content to MODAL_CONTENT
                3. Add a <button> below with onClick={() => openModal('yourId')}
              ════════════════════════════════════════════════════════════════ */}
                    <button
                        className="checkpoint checkpoint--beer"
                        onClick={() => openModal("beer")}
                        aria-label="Interact: beer mug"
                    >
                        <img src={beerImg} alt="Beer mug" />
                        <img src={clickImg} className="click-hint" alt="" />
                    </button>

                    <button
                        className="checkpoint checkpoint--maria"
                        onClick={() => openModal("maria")}
                        aria-label="Interact: Maria statue"
                    >
                        <img src={mariaImg} alt="Maria" />
                        <img src={clickImg} className="click-hint" alt="" />
                    </button>

                    <button
                        className="checkpoint checkpoint--silvius"
                        onClick={() => openModal("silvius")}
                        aria-label="Interact: Silvius Brabo"
                    >
                        <img src={silviusImg} alt="Silvius" />
                        <img src={clickImg} className="click-hint" alt="" />
                    </button>

                </div>{/* end st-track */}
            </div>{/* end st-wrapper */}

            {/* ── Modal overlay ─────────────────────────────────────────────────── */}
            {modal && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                    <div className="modal">
                        <img src={greenSquareImg} className="modal__deco" alt="" />

                        <button className="modal__close" onClick={closeModal} aria-label="Close">
                            <img src={bigCrossImg} alt="" />
                        </button>

                        <div className="modal__media">
                            <img src={modal.image} className="modal__img" alt="" />
                            <img src={phoneDemoFillImg} className="modal__phone" alt="" />
                        </div>

                        <div className="modal__body">
                            <h2 className="modal__title">{modal.title}</h2>
                            <p className="modal__text">{modal.body}</p>
                            <button className="modal__cta close-btn" onClick={closeModal}>
                                <img src={bgNav} alt="" className="close-bg" />
                                <img src={closeIcon} alt="sluit menu" className="close-icon" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
