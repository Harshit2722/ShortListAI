import AuthSidePanel from "./AuthSidePanel";
import Silk from "../../components/backgrounds/Silk/Silk";

function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Silk
          speed={10}
          scale={1}
          color="#363846"
          noiseIntensity={0.7}
          rotation={0}
        />
      </div>

      <div className="fixed inset-0 z-10 bg-black/45 pointer-events-none" />

      <main className="relative z-20 min-h-screen p-6">

        <div
          className="
            mx-auto
            flex
            min-h-[calc(100vh-48px)]
            max-w-7xl
            overflow-hidden
            rounded-[32px]
            border border-white/15
            transition ease-in-out duration-200
            hover:border-white/28
            hover:shadow-[0_10px_30px_rgba(255,255,255,0.08)]
            bg-white/[0.035]
            backdrop-blur-xl
          "
        >
          <AuthSidePanel />

          <div className="flex flex-1 items-center justify-center p-8 lg:p-14">
            {children}
          </div>

        </div>

      </main>
    </div>
  );
}

export default AuthLayout;