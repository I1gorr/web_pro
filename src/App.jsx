import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Heropage from "./pages/landingPage/heropage";
import SignInPage from "./pages/signIn/Card"; // Ensure this path is correct
import Forum from "./pages/forum/forum"
import MyApp from "./pages/pdfPage/pdfPage";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Heropage />} />
        <Route path="/signin" element={<SignInPage />} /> {/* NO `/Card` */}
        <Route path="/forum" element={<Forum />} />
        <Route path="/notes" element={<MyApp />} />
      </Routes>
    </Router>
  );
}
