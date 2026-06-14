import "./loadingrecommendation.css";
import gsap from "gsap";
import { useState, useEffect, useRef } from "react";

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
    return (
        <>
            <div className="loading-recommendation">
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
