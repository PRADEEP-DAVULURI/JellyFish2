import React, { useEffect } from "react";
import "./JellyfishLogo.css";
import Splitting from "splitting";

const JellyfishLogo = () => {
  useEffect(() => {
    Splitting();
  }, []);

  return (
    <div className="jellyfish-container">
      <div className="jellyfish">
        <div className="head-wave"></div>
        <div className="eye left"></div>
        <div className="eye right"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
        <div className="tentacle"></div>
      </div>
      <div className="logo-text-container">
        <h2 data-splitting className="headline headline--float">JellyFish</h2>
      </div>
    </div>
  );
};

export default JellyfishLogo;