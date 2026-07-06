import { Link } from "react-router-dom";

function FooterSection() {
  return (
    <footer className="border-t border-zinc-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row">

        <p>© {new Date().getFullYear()} Shortlist AI. All rights reserved.</p>

        <div className="flex items-center gap-6">

          <Link
            to="#"
            className="transition hover:text-white"
          >
            Privacy Policy
          </Link>

          <Link
            to="#"
            className="transition hover:text-white"
          >
            Terms Of Service
          </Link>

        </div>

      </div>
    </footer>
  );
}

export default FooterSection;