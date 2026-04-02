import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-earth-dark text-primary-foreground">
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="GeoCore Minerals" className="h-10 w-auto brightness-200" />
            <span className="font-heading text-lg font-bold">GeoCore Minerals</span>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Premium mineral processing solutions. Specializing in limestone, dolomite, and lepidolite extraction and processing.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { to: "/about", label: "About Us" },
              { to: "/products", label: "Products" },
              { to: "/services", label: "Services" },
              { to: "/blog", label: "Insights" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold mb-4">Our Products</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>Limestone Powder & Lumps</li>
            <li>Dolomite Powder & Lumps</li>
            <li>Lepidolite Powder & Lumps</li>
            <li>Custom Processing</li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              123 Industrial Avenue, Mining District, MD 12345
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              +1 (234) 567-890
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              info@geocoreminerals.com
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} GeoCore Minerals. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
