import { Link } from "react-router-dom";
import Logo from "./Logo";
import Button from "../common/Button";

function Navbar() {

  const NavClass = "relative text-zinc-300 transition-colors duration-200 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#141414]/80 backdrop-blur-lg">
      <div className="grid h-24 grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-10 2xl:px-14">

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
            <Button className="px-6">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;