import { Link } from 'react-router-dom';
import { FaXTwitter } from 'react-icons/fa6';
import { FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/personal/logo4.png" alt="EvolucionaT Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-primary">EvolucionaT</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Transformando vidas a través de un enfoque integral de salud y bienestar, respaldado por tecnología de IA.
            </p>
            <div className="space-y-2">
              <a href="tel:+34900000000" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <FaPhone className="w-4 h-4" /> +56 985170385
              </a>
              <a href="mailto:info@evoluciona-t.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <FaEnvelope className="w-4 h-4" /> info@evoluciona-t.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nosotros</Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Servicios</Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/training" className="text-muted-foreground hover:text-primary transition-colors">Entrenamiento Personalizado</Link>
              </li>
              <li>
                <Link to="/services/nutrition" className="text-muted-foreground hover:text-primary transition-colors">Planes de Nutrición</Link>
              </li>
              <li>
                <Link to="/services/wellness" className="text-muted-foreground hover:text-primary transition-colors">Bienestar Integral</Link>
              </li>
              <li>
                <Link to="/services/coaching" className="text-muted-foreground hover:text-primary transition-colors">Coaching de Vida</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mantente Conectado</h3>
            <p className="text-muted-foreground mb-4">Suscríbete para recibir consejos y novedades sobre salud y bienestar.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">Política de Privacidad</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Términos de Servicio</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">Política de Cookies</Link>
              <p>© 2025 EvolucionaT. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;