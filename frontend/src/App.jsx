import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import UploadSection from "./components/UploadSection.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import { useAnalysis } from "./hooks/useAnalysis.js";

export default function App() {
  const analysis = useAnalysis();

  return (
    <>
      <Navbar />
      <main>
        <UploadSection analysis={analysis} />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
