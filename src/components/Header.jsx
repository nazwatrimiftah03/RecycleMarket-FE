import { Link, useLocation } from "react-router";
import LogoImage from "../assets/logo.png";
import { Button } from "./ui/button";

export function Header() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 bg-green-100 border-b-2 border-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={LogoImage}
              alt="ReCycle Market Logo" 
              className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-700 size-10 text-white object-cover"
            />
            <span className="text-green-600">ReCycle Market</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              asChild
              variant={isActive("/") ? "default" : "ghost"}
              className={isActive("/") ? "bg-green-500 hover:bg-green-600" : ""}
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/eco-tips") ? "default" : "ghost"}
              className={isActive("/eco-tips") ? "bg-green-500 hover:bg-green-600" : ""}
            >
              <Link to="/eco-tips">Eco-Tips</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/team") ? "default" : "ghost"}
              className={isActive("/team") ? "bg-green-500 hover:bg-green-600" : ""}
            >
              <Link to="/team">Team</Link>
            </Button>
            <Button asChild className="bg-green-500 hover:bg-green-600">
              <Link to="/login-admin">Login Admin</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
