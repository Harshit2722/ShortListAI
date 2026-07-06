import AuthSidePanel from "./AuthSidePanel";

function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#141414] p-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl overflow-hidden rounded-[32px] border border-zinc-800 bg-[#181818]">

        <AuthSidePanel />

        <div className="flex flex-1 items-center justify-center p-8 lg:p-14">
          {children}
        </div>

      </div>
    </main>
  );
}

export default AuthLayout;