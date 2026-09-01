import RecruiterNavbar from "../components/layout/RecruiterNavbar";
import Silk from "../components/backgrounds/Silk/Silk";

const RecruiterLayout = ({ children }) => {
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

            <RecruiterNavbar />

            <div className="relative z-20 flex min-h-screen flex-col">
                <main className="w-full flex-1 px-6 pt-28 pb-12 lg:px-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default RecruiterLayout;