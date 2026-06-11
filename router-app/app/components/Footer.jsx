import "./Footer.css";
import footerBg from "../assets/images/footerbg.png";
import footerImg from "../assets/images/footerimg.png";
import mailIcon from "../assets/mail.svg";
import phoneIcon from "../assets/phone.svg";
import shareIcon from "../assets/icons/iconupload.svg";

async function handleShare() {
  if (navigator.share) {
    await navigator.share({
      title: "Antwerp On Tap",
      text: "Taste it, experience it, share it.",
      url: window.location.origin,
    });
  } else {
    await navigator.clipboard.writeText(window.location.origin);
    alert("Link gekopieerd!");
  }
}

export default function Footer() {
  return (
    <footer className="footer">
      <img src={footerBg} alt="" className="footer__bg" />
      <img src={footerImg} alt="" className="footer__img" />

      <div className="footer__content">
        <div className="footer__text">
          <p className="footer__antwerp">ANTWERP</p>
          <p className="footer__ontap">ON TAP</p>
          <p className="footer__sub">Taste it, experience it,<br />share it.</p>
        </div>

        <div className="footer__actions">
          <a href="mailto:info@visitantwerpen.be" className="footer__btn">
            <img src={mailIcon} alt="mail" />
          </a>
          <a href="tel:+3222113333" className="footer__btn">
            <img src={phoneIcon} alt="phone" />
          </a>
          <button className="footer__btn" onClick={handleShare}>
            <img src={shareIcon} alt="share" />
          </button>
        </div>
      </div>
    </footer>
  );
}
