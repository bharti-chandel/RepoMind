import { LogOut, Github, Twitter, MessageCircle, Share2, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-6 md:px-8 py-4 flex items-center justify-between bg-white sticky top-0 z-50 border-b border-black/5">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-display text-lg font-medium tracking-tight text-primary">RepoMind</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-6">
          <Link to="#" className="text-[13px] font-medium text-primary border-b-2 border-primary pb-0.5">Overview</Link>
          <Link to="#" className="text-[13px] font-medium text-primary hover:opacity-70 transition-opacity">Plans</Link>
          <div className="flex items-center gap-4 ml-2">
            <Link to="#" className="text-primary hover:opacity-70 transition-opacity">
              <Github className="w-4 h-4" />
            </Link>
            <Link to="#" className="text-primary hover:opacity-70 transition-opacity">
              <Twitter className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <Link 
          to="/dashboard"
          className="px-4 py-1.5 bg-white border border-black rounded-lg text-[13px] font-semibold hover:bg-black hover:text-white transition-all ml-2"
        >
          Get the app
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden p-2 hover:bg-black/5 rounded-lg"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-black/5 p-6 flex flex-col gap-4 md:hidden shadow-xl animate-in slide-in-from-top duration-200">
          <Link to="#" className="text-sm font-medium text-primary py-2 border-b border-black/5">Overview</Link>
          <Link to="#" className="text-sm font-medium text-primary py-2 border-b border-black/5">Plans</Link>
          <Link to="/dashboard" className="text-sm font-bold text-accent py-2">Dashboard</Link>
          <div className="flex items-center gap-4 pt-2">
            <Github className="w-5 h-5 text-primary/60" />
            <Twitter className="w-5 h-5 text-primary/60" />
          </div>
        </div>
      )}
    </nav>
  );
}
