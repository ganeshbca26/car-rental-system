import React from 'react';
import { Car } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1c30] text-white w-full py-8 px-4 md:px-8 mt-auto border-t border-[#131b2e]">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0051d5] flex items-center justify-center text-white">
              <Car className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#f8f9ff]">RIDEMATE</span>
          </div>
          <p className="text-xs text-[#bec6e0]/80">
            © 2026 RIDEMATE Car Rental Marketplace & Fleet Operations. All rights reserved.
          </p>
        </div>

        <ul className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-[#bec6e0]">
          <li>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#help" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
              Help Center
            </a>
          </li>
          <li>
            <a href="#fleet" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
              Fleet Standards
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
