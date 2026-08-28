import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 500);
        };

        window.addEventListener("scroll", toggleVisibility);

        return () =>
            window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollTop}
            className={`
        fixed bottom-8 right-8 z-50
        h-14 w-14 rounded-full
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        text-white
        shadow-lg
        transition-all duration-300

        hover:-translate-y-1
        hover:border-white/20
        hover:bg-white/10

        ${visible
                    ? "opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 translate-y-4"
                }
      `}
        >
            <ArrowUp className="mx-auto" size={22} />
        </button>
    );
}

export default ScrollToTopButton;