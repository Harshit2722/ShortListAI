import Navbar from "../../components/layout/Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import Workflow from "./Workflow";
import CTA from "./CTA";
import FooterSection from "./FooterSection";


function Home() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Workflow />
      <CTA />
      <FooterSection />
    </div>
  );
}

export default Home;