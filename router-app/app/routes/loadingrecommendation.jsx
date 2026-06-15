import "./loadingrecommendation.css";
import gsap from "gsap";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import greenCapImg from "../assets/loading-recommendation/green-bottle-cap.svg";
import orangeCapImg from "../assets/loading-recommendation/orange-bottle-cap.svg";
import person01Img from "../assets/loading-recommendation/person01.avif";
import person02Img from "../assets/loading-recommendation/person02.avif";
import person03Img from "../assets/loading-recommendation/person03.avif";
import person04Img from "../assets/loading-recommendation/person04.avif";
import person05Img from "../assets/loading-recommendation/person05.avif";
import person06Img from "../assets/loading-recommendation/person06.avif";
import person07Img from "../assets/loading-recommendation/person07.avif";
import person08Img from "../assets/loading-recommendation/person08.avif";

export default function loadingRecommendation() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const photos = [
        person01Img,
        person02Img,
        person03Img,
        person04Img,
        person05Img,
        person06Img,
        person07Img,
        person08Img,
    ]

    function getRandomPhoto(excludedPhotos = []) {
        const available = photos.filter(
            photo => !excludedPhotos.includes(photo)
        );

        return available[
            Math.floor(Math.random() * available.length)
        ];
    }

    const [photoA] = useState(getRandomPhoto);
    const [photoB] = useState(() => getRandomPhoto([photoA]));

    const imgARef = useRef(null);
    const imgBRef = useRef(null);
    const orangeCapRef = useRef(null);
    const greenCapRef = useRef(null);

    useEffect(() => {
        const showTimer = setTimeout(() => setVisible(true), 50);
        const hideTimer = setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem("skip_home_animation", "1");
            setTimeout(() => navigate("/"), 600);
        }, 8000);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    useEffect(() => {
        gsap.set(orangeCapRef.current, { zIndex: 2 });
        gsap.set(greenCapRef.current, { zIndex: 1 });

        const currentPhotos = { a: photoA, b: photoB };

        function swapZIndex() {
            const orange = orangeCapRef.current;
            const green = greenCapRef.current;
            if (orange.style.zIndex === "2") {
                orange.style.zIndex = "1";
                green.style.zIndex = "2";
            } else {
                orange.style.zIndex = "2";
                green.style.zIndex = "1";
            }
        }

        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.5
        });

        // CROSS FORWARD
        tl.to(orangeCapRef.current, {
            x: -40,
            y: 56,
            duration: 1.2,
            ease: "back.inOut(1.7)"
        }, 0);

        tl.to(greenCapRef.current, {
            x: 40,
            y: -56,
            duration: 1.2,
            ease: "back.inOut(1.7)"
        }, 0);

        // SWAP PHOTOS
        tl.call(() => {
            const newA = getRandomPhoto([currentPhotos.a, currentPhotos.b]);
            const newB = getRandomPhoto([currentPhotos.a, currentPhotos.b, newA]);
            currentPhotos.a = newA;
            currentPhotos.b = newB;
            if (imgARef.current) imgARef.current.src = newA;
            if (imgBRef.current) imgBRef.current.src = newB;
        }, null, 0.6);

        // Z-INDEX SWAP at the "back" peak of the forward cross (~20% into the ease)
        tl.call(swapZIndex, null, 0.2);

        // PAUSE after crossing forward, then CROSS BACK
        tl.to(orangeCapRef.current, {
            x: 40,
            y: -56,
            duration: 1.2,
            ease: "back.inOut(1.7)",
        }, "+=0.5");

        tl.to(greenCapRef.current, {
            x: -40,
            y: 56,
            duration: 1.2,
            ease: "back.inOut(1.7)",
        }, "<");

        // Z-INDEX SWAP at the "back" peak of the return cross (return starts at 1.7s, peak ~0.2s in)
        tl.call(swapZIndex, null, 1.9);

        return () => tl.kill();
    }, []);

    return (
        <>
            <div className={`loading-recommendation${visible ? " loading-recommendation--visible" : ""}`}>
                <div className="loading-animation">
                    <div ref={orangeCapRef} className="cap cap--orange">
                        <img className="background" src={orangeCapImg} alt="" />
                        <div className="photo">
                            <img ref={imgARef} src={photoA} alt="" />
                        </div>
                    </div>
                    <div ref={greenCapRef} className="cap cap--green">
                        <img className="background" src={greenCapImg} alt="" />
                        <div className="photo">
                            <img ref={imgBRef} src={photoB} alt="" />
                        </div>
                    </div>
                </div>
                <h1 className="loading-recommendation__title">Finding the <span>Antwerp local</span> who gets your taste...</h1>
            </div>
        </>
    )
}
