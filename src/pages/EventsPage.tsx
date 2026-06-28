import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EventsPage = () => {
  const { events } = useEvents();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Nossos Eventos - Grand Rounds em Oncologia"
        description="Explore nossa programacao de Grand Rounds em Oncologia, encontros cientificos dedicados a discussao de casos oncologicos desafiadores e a construcao coletiva do conhecimento."
        keywords="eventos oncologia, Grand Rounds, congressos medicos, simposios oncologia, educacao medica continuada, casos clinicos oncologia"
        url="/eventos"
      />
      <Header />
      <main className="pt-16 lg:pt-20">
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Nossos Eventos
              </h1>
              <div className="text-lg md:text-xl text-primary-foreground/80 space-y-4 text-left">
                <p>
                  Explore nossa programacao de Grand Rounds em Oncologia, encontros
                  cientificos dedicados a discussao de casos oncologicos desafiadores e a
                  construcao coletiva do conhecimento.
                </p>
                <p>
                  Realizados de forma periodica, os Grand Rounds promovem a integracao da
                  equipe multiprofissional, fortalecendo a tomada de decisao baseada em
                  evidencias e na experiencia compartilhada.
                </p>
                <p>
                  Cada encontro e uma oportunidade de aprofundamento tecnico,
                  atualizacao cientifica e troca qualificada, sempre com foco na
                  excelencia do cuidado ao paciente oncologico.
                </p>
                <p>Saiba mais sobre cada evento abaixo.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <OptimizedImage
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      fallback="/placeholder.svg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.shortDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">
                        {event.location}, {event.city} - {event.state}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/evento/${event.slug}`} className="w-full">
                      <Button variant="default" className="w-full">
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
