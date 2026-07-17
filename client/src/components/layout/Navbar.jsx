import { Link } from "react-router-dom";
import Logo from "./Logo";
import Button from "../common/Button";

function Navbar() {

  const NavClass = "relative text-zinc-300 transition-colors duration-200 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-2xl border-b border-white/8">
      <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-10">

        <div className="justify-self-start">
          <Logo />
        </div>

        <nav className="flex justify-self-center items-center gap-8">
          <a href="#features" className={NavClass}>
            Features
          </a>

          <a href="#workflow" className={NavClass}>
            Workflow
          </a>
        </nav>

        <div className="flex justify-self-end items-center gap-5">
          <Link
            to="/login"
            className="text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Sign In
          </Link>

          <Link to="/register">
            <Button>Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;