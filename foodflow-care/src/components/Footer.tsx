import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">SustainaServe</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Connecting surplus food with those who need it — instantly and responsibly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/providers" className="hover:text-secondary transition-colors">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link to="/ngos" className="hover:text-secondary transition-colors">
                  Join as NGO
                </Link>
              </li>
              <li>
                <Link to="/volunteers" className="hover:text-secondary transition-colors">
                  Volunteer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>hello@sustainaserve.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Campus, Local Community</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm">
          <p>© 2025 SustainaServe | Built for Sustainability Hackathon</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
