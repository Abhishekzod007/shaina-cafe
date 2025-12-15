//import { useEffect } from "react";
import "../styles/components.css";

//import "./Hero.css";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">

      {/* Background fog overlay */}
      <div className="fog"></div>

      {/* Gold particles */}
      <div className="particles"></div>

      {/* CONTENT */}
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="typing">Shaina Café Rawatsar</span>
        </h1>

        <p className="hero-sub">
          Where Premium Taste Meets Premium Experience.
        </p>

        <Link to="/menu" className="hero-btn">Explore Menu</Link>
      </div>
      
    </section>
  );
}
