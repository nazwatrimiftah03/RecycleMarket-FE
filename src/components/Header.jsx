import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react"; // Import icon X untuk tombol tutup
import LogoImage from "../assets/logo.png";
import { Button } from "./ui/button";

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Fungsi untuk menutup menu saat link diklik
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/eco-tips", label: "Eco-Tips" },
    { to: "/team", label: "About" },
    { to: "/login-admin", label: "Login Seller/admin", primary: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-green-100 border-b-2 border-gray-300 relative">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img 
              src={LogoImage}
              alt="ReCycle Market Logo" 
              className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-700 size-10 text-white object-cover"
            />
            <span className="text-green-600 font-bold text-lg hidden sm:block">ReCycle Market</span>
          </Link>

          {/* 1. Desktop Navigation (Dikontrol oleh CSS .header-desktop-nav) */}
          <nav className="header-desktop-nav">
            {navLinks.map((link) => (
              <Button
                key={link.to}
                asChild
                variant={link.primary ? "default" : (isActive(link.to) ? "default" : "ghost")}
                className={link.primary ? "bg-green-500 hover:bg-green-600" : (isActive(link.to) ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-200")}
              >
                <Link to={link.to}>{link.label}</Link>
              </Button>
            ))}
          </nav>

          {/* 2. Mobile Hamburger Trigger (Dikontrol oleh CSS .header-mobile-trigger) */}
          <div className="header-mobile-trigger">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white border-green-600 text-green-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Menu Dropdown (Muncul jika state True + CSS Posisi Absolute) */}
      {isMobileMenuOpen && (
        <div className="header-mobile-menu md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}