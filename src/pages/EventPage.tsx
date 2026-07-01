import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import SpeakerCard from "@/components/SpeakerCard";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { fixImagePath } from "@/lib/bannerMappings";

const safeEncodeUrl = (value: string) => {
  try {
    return encodeURI(decodeURI(value));
  } catch {
    return value;
  }
};

const EventPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { events } = useEvents();
  const isMobile = useIsMobile();
  const event = events.find((item) => item.slug === slug);
  const mapsUrl = event
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${event.location}, ${event.address}, ${event.city} - ${event.state}`
      )}`
    : "";

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Evento não encontrado"
          description="O evento que você está procurando não foi encontrado. Explore nossos outros eventos científicos em oncologia."
          url={`/evento/${slug}`}
          noindex
        />
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Evento não encontrado
            </h1>
            <p className="text-muted-foreground mb-8">
              O evento que você está procurando não foi encontrado. Pode ter sido
              removido ou o endereço pode estar incorreto.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const description =
    event.shortDescription ||
    (event.fullDescription
      ? `${event.fullDescription.substring(0, 160).replace(/\n/g, " ")}...`
      : `Participe do ${event.title} em ${event.city} - ${event.state}. ${event.date} às ${event.time}.`);

  const keywords = [
    event.title.toLowerCase(),
    "oncologia",
    "evento médico",
    "Grand Rounds",
    event.city,
    event.state,
    "congresso médico",
    "educação médica continuada",
  ].join(", ");

  const heroImage = isMobile
    ? fixImagePath(event.mobileImage || event.image)
    : fixImagePath(event.image);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={event.title}
        description={description}
        keywords={keywords}
        image={event.mobileImage || event.image}
        url={`/evento/${event.slug}`}
        type="article"
      />
      <Header />

      <section className="relative pt-16 lg:pt-20">
        <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
          <div
            className={`absolute inset-0 bg-cover bg-no-repeat ${
              event.slug === "tumores-ginecologicos" ||
              event.slug === "mama" ||
              event.slug === "hematologia"
                ? "bg-left md:bg-center scale-x-[-1] md:scale-x-100"
                : "bg-right md:bg-center"
            }`}
            style={{ backgroundImage: `url("${safeEncodeUrl(heroImage)}")` }}
          />
          <div className="absolute inset-0 hero-overlay lg:hidden" />
          <div className="relative h-full flex items-center lg:hidden">
            <div className="container mx-auto px-4">
              <Link
                to="/eventos"
                className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
              >
                <ArrowLeft size={18} />
                Voltar para todos os eventos
              </Link>

              <div className="max-w-3xl animate-fade-in-up">
                <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium backdrop-blur-sm border border-accent/30 mb-4">
                  {event.date}
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground leading-tight mb-4">
                  {event.title}
                </h1>
                {event.shortDescription && (
                  <p className="text-lg text-primary-foreground/80">
                    {event.shortDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Sobre o Evento
                </h2>
                {event.fullDescription ? (
                  <div className="text-muted-foreground leading-relaxed text-lg space-y-4">
                    {event.fullDescription.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Em breve mais informações sobre este evento.
                  </p>
                )}
              </section>

              <section>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
                    Inscrição gratuita
                  </div>
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
                    Evento presencial
                  </div>
                </div>
              </section>

              {(event.targetAudience || event.objective) && (
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {event.targetAudience && (
                    <div className="bg-muted/50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground">
                          Público-alvo
                        </h3>
                      </div>
                      <p className="text-muted-foreground">{event.targetAudience}</p>
                    </div>
                  )}

                  {event.objective && (
                    <div className="bg-muted/50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground">
                          Objetivo
                        </h3>
                      </div>
                      <p className="text-muted-foreground">{event.objective}</p>
                    </div>
                  )}
                </section>
              )}

              {event.schedule && event.schedule.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6">
                    Programacao
                  </h2>
                  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                    {event.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                      >
                        <div className="w-24 shrink-0">
                          <p className="text-sm font-semibold text-primary">{item.time}</p>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-1">{item.title}</p>
                          {item.speaker && (
                            <p className="text-sm text-muted-foreground">{item.speaker}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {event.speakers && event.speakers.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6">
                    Palestrantes
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {event.speakers.map((speaker) => (
                      <SpeakerCard key={speaker.id} speaker={speaker} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Local do Evento
                </h2>
                <div className="bg-muted/50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg hero-gradient flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        {event.location}
                      </h3>
                      {event.address && <p className="text-muted-foreground mb-1">{event.address}</p>}
                      <p className="text-muted-foreground">
                        {event.city} - {event.state}
                      </p>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <span>Ver no Google Maps</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-medium text-foreground">{event.date}</p>
                    </div>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Horário</p>
                        <p className="font-medium text-foreground">{event.time}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Local</p>
                      <p className="font-medium text-foreground">
                        {event.city} - {event.state}
                      </p>
                    </div>
                  </div>
                </div>

                <EventRegistrationForm eventTitle={event.title} eventSlug={event.slug} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventPage;
