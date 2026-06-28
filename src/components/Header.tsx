import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMarcarConsultaClick = () => {
    window.open("https://wa.me/558398778332", "_blank");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/Logo_COLORIDA.png" 
              alt="OncoAssist" 
              className="h-[200px] lg:h-[240px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <a
              href="#sobre"
              onClick={(e) => {
                e.preventDefault();
                const sobreSection = document.getElementById('sobre');
                if (sobreSection) {
                  sobreSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/#sobre');
                }
              }}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Sobre
            </a>
            <Link
              to="/eventos"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Eventos
            </Link>
            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault();
                const footer = document.getElementById('contato');
                if (footer) {
                  footer.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/#contato');
                }
              }}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Contato
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              variant="cta" 
              size="lg"
              onClick={handleMarcarConsultaClick}
              className="bg-whatsapp hover:bg-whatsapp-hover text-white"
            >
              MARCAR CONSULTA
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <a
                href="#sobre"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  const sobreSection = document.getElementById('sobre');
                  if (sobreSection) {
                    sobreSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/#sobre');
                  }
                }}
              >
                Sobre
              </a>
              <Link
                to="/eventos"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </Link>
              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  const footer = document.getElementById('contato');
                  if (footer) {
                    footer.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/#contato');
                  }
                }}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Contato
              </a>
              <Button 
                variant="cta" 
                className="w-full mt-2 bg-whatsapp hover:bg-whatsapp-hover text-white"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleMarcarConsultaClick();
                }}
              >
                MARCAR CONSULTA
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
