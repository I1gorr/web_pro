import "./heropage.css";
import AnimatedTitle from "./AnimatedTitle";
import AboutSection from "./AboutSection";
import SignIn from "./SignIn";
import DiverseNotesRepository from "./DiverseNotes";


function Heropage() {
  return (
    <>
    <div id="root">
      <AnimatedTitle></AnimatedTitle>
      <AboutSection />
      <SignIn />
      <DiverseNotesRepository />
    </div>
    </>
  );
}

export default Heropage;
