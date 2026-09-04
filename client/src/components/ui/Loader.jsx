import { RefreshCw } from "lucide-react";
import Card from "../common/Card";

function Loader({
  title = "Loading Shortlist AI",
  subtitle = "Please wait a moment...",
  fullScreen = false,
  className = ""
}) {
  const content = (
    <Card className="flex flex-col items-center justify-center p-10 text-center max-w-sm w-full mx-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md">
        <RefreshCw size={22} className="animate-spin text-white" />
      </div>
      {title && <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>}
      {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
    </Card>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`flex min-h-[380px] w-full items-center justify-center ${className}`}>
      {content}
    </div>
  );
}

export default Loader;