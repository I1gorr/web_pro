import React from "react";
import Lottie from "lottie-react";
import animationData from "./assets/animatedR.json"; 

const DiverseNotesRepository = () => {
  return (
    <div className="container" style={{ width: "100%", height: "100%" }} >
      <div className="text-content">
        <h1 style={{ paddingBottom:"30px"}}>DIVERSE NOTES REPOSITORY</h1>

        <div className="feature">
          <h3>Upload Notes</h3>
          <p>Share your bite-sized summaries and comprehensive notes with the EduShare community.</p>
        </div>

        <div className="feature">
          <h3>Community Sharing</h3>
          <p>Savour a variety of user-contributed notes across multiple disciplines.</p>
        </div>

        <div className="feature">
          <h3>AI Assisted</h3>
          <p>Clear your doubts on the go with our AI-powered assistant, ready 24/7 just for you.</p>
        </div>
      </div>

      <div className="animation-container">
        <Lottie animationData={animationData} loop autoplay style={{ width: "50%", height: "auto" }} />
      </div>
    </div>
  );
};

export default DiverseNotesRepository;
