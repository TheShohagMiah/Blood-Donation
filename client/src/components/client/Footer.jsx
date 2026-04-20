import React from "react";
import { Link } from "react-router-dom";
import {
  Droplet,
  Mail,
  Phone,
  MapPin,
  Send,
  // Facebook,
  // Twitter,
  // Instagram,
  // Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Find Donors", href: "/find-donors" },
      { name: "Request Blood", href: "/requests" },
      { name: "Emergency Map", href: "/map" },
      { name: "Eligibility", href: "/eligibility" },
    ],
    company: [
      { name: "Our Story", href: "/about" },
      { name: "Partners", href: "/partners" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-[var(--color-surface-primary)] border-t border-[var(--color-border-default)] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Identity & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-[var(--color-primary-600)] p-2 rounded-md transition-all group-hover:shadow-lg group-hover:shadow-primary-600/20">
                <Droplet size={22} className="text-white fill-current" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-[var(--color-content-primary)]">
                Life
                <span className="text-[var(--color-primary-600)]">Flow</span>
              </span>
            </Link>

            <p className="text-sm text-[var(--color-content-muted)] leading-relaxed max-w-[320px] border-l-2 border-[var(--color-border-default)] pl-6">
              The nation's high-latency blood donation network. Utilizing
              geospatial matching to connect donors in real-time.
            </p>

            <div className="space-y-4 pt-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary-600)]">
                Subscribe
              </h3>
              <div className="flex max-w-[320px] group relative">
                <input
                  type="email"
                  placeholder="PROTOCOL@EMAIL.COM"
                  className="w-full bg-[var(--color-surface-secondary)] border border-[var(--color-border-default)] rounded-md h-12 px-5 text-[10px] font-bold tracking-widest focus:outline-none focus:border-[var(--color-primary-600)] transition-all uppercase"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary-600 text-white rounded-md  transition-all flex items-center justify-center">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Matrix */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-content-primary)] border-b border-[var(--color-border-default)] pb-2 w-fit">
                {title}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-content-muted)] hover:text-[var(--color-primary-600)] transition-colors flex items-center gap-2 group"
                    >
                      <span className="h-px w-0 bg-[var(--color-primary-600)] transition-all group-hover:w-3" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Social Telemetry */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-content-primary)] border-b border-[var(--color-border-default)] pb-2 w-fit">
              Telemetry
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+8801234567890"
                className="flex items-center gap-3 text-[11px] font-bold text-[var(--color-content-muted)] hover:text-[var(--color-primary-600)] transition-colors tabular-nums"
              >
                <Phone size={14} /> +880 1234-567890
              </a>
              {/* <div className="flex gap-2">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--color-border-default)] text-[var(--color-content-muted)] hover:bg-[var(--color-primary-600)] hover:text-white hover:border-[var(--color-primary-600)] transition-all"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-10 border-t border-[var(--color-border-default)] flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
              © {currentYear} LIFEFLOW SECURE. TERMINAL V3.4.0
            </p>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
            <Link
              to="/privacy"
              className="hover:text-[var(--color-primary-600)] transition-colors"
            >
              Privacy_Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-[var(--color-primary-600)] transition-colors"
            >
              Terms_Of_Service
            </Link>
            <span className="flex items-center gap-2 opacity-50">
              <MapPin size={12} /> LOC: DHAKA_BD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
