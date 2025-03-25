import React from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-black dark:bg-gray-900 font-bold text-white p-4 flex items-center justify-between shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-16 py-10 md:py-24">
        <div className="flex justify-between gap-100">
          <div className="space-y-6">
            <h3 className="text-xl font-medium tracking-tight">Company</h3>
            <ul className="space-y-4">
              {["About", "Careers", "News", "Privacy"].map((item) => (
                <li key={item}>
                  <Link 
                    href="/" 
                    className="text-white hover:text-black transition-colors duration-300 inline-flex items-center group"
                  >
                    {item}
                    <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight size={14} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-medium tracking-tight">Support</h3>
            <ul className="space-y-4">
              {["Contact", "FAQ", "Resources", "Accessibility"].map((item) => (
                <li key={item}>
                  <Link 
                    href="/" 
                    className="text-white hover:text-black transition-colors duration-300 inline-flex items-center group"
                  >
                    {item}
                    <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight size={14} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-medium tracking-tight">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 text-neutral-400 mt-1" size={16} />
                <span className="text-white">
                  123 Design Avenue<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-white" size={16} />
                <a 
                  href="tel:+1234567890" 
                  className="text-white hover:text-black transition-colors duration-300"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-white" size={16} />
                <a 
                  href="mailto:hello@example.com" 
                  className="text-white hover:text-black transition-colors duration-300"
                >
                  hello@example.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm">
            © {currentYear} Company. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-8">
            <a 
              href="#" 
              className="text-white text-sm hover:text-black transition-colors duration-300"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-white text-sm hover:text-black transition-colors duration-300"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-white text-sm hover:text-black transition-colors duration-300"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;