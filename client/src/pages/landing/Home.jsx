import Navbar from "../../components/layout/Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import Workflow from "./Workflow";
import CTA from "./CTA";
import FooterSection from "./FooterSection";

import Silk from "../../components/backgrounds/Silk/Silk";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Silk
          speed={10}
          scale={1}
          color="#363846"
          noiseIntensity={0.6}
          rotation={0}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-10 bg-black/45" />

      <main className="relative z-20">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <Workflow />
        <CTA />
        <FooterSection />
      </main>

      <ScrollToTopButton />

    </div>
  );
}

export default Home;