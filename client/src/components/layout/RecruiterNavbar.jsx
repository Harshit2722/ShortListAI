
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";

const navItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        label: "Jobs",
        path: "/jobs",
    },
    {
        label: "Candidates",
        path: "/candidates",
    },
];

const RecruiterNavbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const profileDropdownRef = useRef(null);

    const { user, logout } = useAuth();

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            profileDropdownRef.current &&
            !profileDropdownRef.current.contains(event.target)
        ) {
            setIsProfileOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-2xl border-b border-white/8">
            <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-10">

                <div className="justify-self-start">
                    <Logo />
                </div>

                <nav className="hidden md:flex justify-self-center items-center gap-8">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 ${
                                    isActive
                                        ? "text-white after:w-full"
                                        : "text-zinc-300 hover:text-white after:w-0 hover:after:w-full"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex justify-self-end items-center">
                    <div
                        className="relative"
                        ref={profileDropdownRef}
                    >
                        <button
                            onClick={() => setIsProfileOpen((prev) => !prev)}
                            className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pr-3 backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/[0.08] cursor-pointer"
                            aria-expanded={isProfileOpen}
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 text-sm font-semibold text-white shadow-inner">
                                {user?.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : "R"}
                            </div>

                            <span className="hidden text-xs font-medium text-zinc-200 sm:inline-block max-w-[120px] truncate">
                                {user?.name || "Recruiter"}
                            </span>

                            <ChevronDown
                                size={14}
                                className={`text-zinc-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-white/15 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-2xl z-50"
                                >
                                    <div className="flex items-center gap-3 pb-3">
                                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 text-base font-semibold text-white shadow-inner">
                                            {user?.name
                                                ? user.name.charAt(0).toUpperCase()
                                                : "R"}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <span className="truncate text-sm font-semibold text-white">
                                                {user?.name || "Recruiter"}
                                            </span>

                                            <span className="truncate text-xs text-zinc-400">
                                                {user?.email ||
                                                    "recruiter@shortlist.ai"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-2 border-t border-white/10" />

                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            logout();
                                        }}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition duration-150 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                                    >
                                        <LogOut size={15} />
                                        <span>Sign Out</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default RecruiterNavbar;