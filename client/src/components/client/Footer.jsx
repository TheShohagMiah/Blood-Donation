import React from "react";
import { Link } from "react-router-dom";
import {
  Droplet,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send,
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
    <footer className="bg-[var(--color-surface-main)] border-t border-[var(--color-border-default)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-[var(--color-primary-600)] p-1.5 rounded-lg transition-transform group-hover:scale-110">
                <Droplet size={20} className="text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--color-content-primary)]">
                Life
                <span className="text-[var(--color-primary-600)]">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-content-muted)] leading-relaxed max-w-[300px]">
              The most trusted blood donation network. Connecting life-savers
              with those in need through modern technology and verified data.
            </p>

            {/* Newsletter Mini-Form */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-content-primary)]">
                Stay Updated
              </h3>
              <div className="flex max-w-[300px] relative">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-lg h-10 px-4 text-xs focus:outline-none focus:border-[var(--color-primary-600)] transition-colors"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-[var(--color-primary-600)] text-white rounded-md hover:bg-[var(--color-primary-700)] transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-content-primary)]">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[13px] text-[var(--color-content-muted)] hover:text-[var(--color-primary-600)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social & Contact Column */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-content-primary)]">
              Connect
            </h3>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg border border-[var(--color-border-default)] text-[var(--color-content-muted)] hover:text-[var(--color-primary-600)] hover:border-[var(--color-primary-600)] transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <p className="flex items-center gap-2 text-[12px] text-[var(--color-content-muted)]">
                <Phone size={14} className="text-[var(--color-primary-600)]" />{" "}
                +880 1234-567890
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border-default)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-[var(--color-content-muted)] tracking-wide font-medium">
            © {currentYear} LIFEFLOW TECHNOLOGY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 text-[12px] text-[var(--color-content-muted)]">
            <Link
              to="/privacy"
              className="hover:text-[var(--color-primary-600)]"
            >
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[var(--color-primary-600)]">
              Terms
            </Link>
            <span className="flex items-center gap-1.5 opacity-60">
              <MapPin size={12} /> Dhaka, BD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
