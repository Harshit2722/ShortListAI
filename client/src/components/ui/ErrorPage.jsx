import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ErrorPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
            
            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[140px]" />
                <div className="absolute -top-32 left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-sky-500/10 blur-[140px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-xl text-center"
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
                        className="rounded-xl bg-white px-7 py-3 font-medium text-black transition hover:bg-zinc-200"
                    >
                        Go Home
                    </Link>

                    <Link
                        to="/dashboard"
                        className="rounded-xl border border-zinc-700 bg-zinc-900 px-7 py-3 font-medium text-white transition hover:border-zinc-500 hover:bg-zinc-800"
                    >
                        Dashboard
                    </Link>

                </div>

            </motion.div>
        </div>
    );
}

export default ErrorPage;