import { Link } from "react-router";
import arrowRight from "../assets/icons/arrow-right.svg";
import "./HomeButton.css";

export default function HomeButton({ className = "" }) {
  return (
    <Link to="/" className={`home-btn ${className}`}>
      <img src={arrowRight} alt="" className="home-btn__icon" />
      home
    </Link>
  );
}
