import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavbarComponent/Navbar";
import PackageDesign from "./pages/PackageDesignComponent/PackageDesign";
import LogoDesign from "./pages/LogoDesignComponent/Logodesigne";
import EditImage from "./pages/EditImageComponent/Editimage";
import AiPhotoshoot from "./pages/AiPhotoshootComponent/Aiphotoshoot";
import PackageRange from "./pages/PackageRange/PackageRange";
import BrandMoodboard from './pages/BrandMoodboard/BrandMoodboard';
import BusinessMaterials from './pages/BusinessMaterials/BusinessMaterials';

// Baaki pages abhi dummy bana lein ya import karein agar ban gaye hain
const DummyPage = ({ title }) => (
  <h2 className="text-center mt-5 text-theme">{title} Coming Soon...</h2>
);

function App() {
  return (
    <Router>
      <Navbar /> {/* Yeh hamesha upar dikhega */}
      <div className="container">
        <Routes>
          {/* Default Route ("/") ab PackageDesign khol dega */}
          <Route path="/" element={<PackageDesign />} />

          {/* Other Routes */}
          <Route path="/logo-design" element={<LogoDesign />} />
          <Route path="/edit-image" element={<EditImage />} />
          <Route path="/ai-photoshoot" element={<AiPhotoshoot />} />
          <Route path="/package-range" element={<PackageRange />} />
          <Route path="/brand-moodboard" element={<BrandMoodboard />} />
          <Route path="/business-cards" element={<BusinessMaterials />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
