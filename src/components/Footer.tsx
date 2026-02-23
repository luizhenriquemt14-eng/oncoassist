import { Link } from "react-router-dom";
import { Instagram, Phone } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { Button } from "./ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { events } = useEvents();
  const upcomingEvents = events.slice(0, 4);

  return (
    <footer id="contato" className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="block mb-4">
              <img 
                src="/logo-cortada.png" 
                alt="OncoAssist" 
                className="h-24 lg:h-28 object-contain"
              />
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              Somos um time de oncologistas comprometidos em oferecer eventos científicos de excelência, sempre com foco no cuidado humanizado e na atualização constante.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/oncoassistoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram OncoAssist"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#sobre" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <Link to="/eventos" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <a 
                  href="#contato" 
                  onClick={(e) => {
                    e.preventDefault();
                    const footer = document.getElementById('contato');
                    if (footer) {
                      footer.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Próximos Eventos</h4>
            <ul className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <li key={event.id}>
                    <Link 
                      to={`/evento/${event.slug}`} 
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {event.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-primary-foreground/50">Nenhum evento disponível</li>
              )}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+558398778332" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Phone size={20} className="shrink-0 text-accent" />
                  (83) 9877-8332
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/oncoassistoficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Instagram size={20} className="shrink-0 text-accent" />
                  @oncoassistoficial
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Button
                onClick={() => window.open("https://wa.me/558398778332", "_blank")}
                className="w-full bg-whatsapp hover:bg-whatsapp-hover text-white"
              >
                MARCAR CONSULTA
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} OncoAssist. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
