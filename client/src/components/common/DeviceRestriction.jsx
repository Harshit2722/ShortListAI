import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import Silk from "../backgrounds/Silk/Silk";

export default function DeviceRestriction() {
  return (
    <div
      id="device-restriction-overlay"
      className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 lg:hidden"
    >
      {/* Background Silk matching 404 ErrorPage & app theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Silk
          speed={10}
          scale={1}
          color="#363846"
          noiseIntensity={0.7}
          rotation={0}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-black/45" />

      {/* Minimal clean content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex max-w-md flex-col items-center text-center"
      >
        {/* Minimal Phone Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
          className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-300 backdrop-blur-md shadow-2xl"
        >
          <Smartphone size={32} strokeWidth={1.5} />
        </motion.div>

        {/* Message */}
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-white leading-snug">
          Please switch to a PC / Laptop to access Shortlist AI
        </h2>

        <p className="mt-3 text-sm text-zinc-400">
          This platform is optimized for larger screens.
        </p>
      </motion.div>
    </div>
  );
}
