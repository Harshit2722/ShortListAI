import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Silk from "../backgrounds/Silk/Silk";
import Button from "../common/Button";

function ErrorPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">

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

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-20 max-w-xl text-center"
            >

                <motion.h1
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 120,
                    }}
                    className="text-[140px] font-black tracking-tight text-white"
                >
                    404
                </motion.h1>

                <h2 className="mt-2 text-4xl font-semibold text-white">
                    Lost in the hiring pipeline?
                </h2>

                <p className="mt-5 text-lg leading-8 text-zinc-400">
                    The page you're looking for doesn't exist or may have been
                    moved. Let's get you back on track.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

                    <Link
                        to="/"
                    >
                        <Button>
                            Go Home
                        </Button>
                    </Link>

                    <Link
                        to="/dashboard"
                    >
                        <Button variant="secondary">
                            Dashboard
                        </Button>
                    </Link>

                </div>

            </motion.div>
        </div>
    );
}

export default ErrorPage;