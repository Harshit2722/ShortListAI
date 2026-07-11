import { LoaderCircle } from "lucide-react";

function Loader({ size = 24 }) {
  return (
    <LoaderCircle
      size={size}
      className="animate-spin text-black"
    />
  );
}

export default Loader;