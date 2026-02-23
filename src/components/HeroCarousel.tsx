import { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { fixImagePath, getMobileBanner } from "@/lib/bannerMappings";

// Componente para cada slide do carrossel
const CarouselSlide = ({ 
  imagePath, 
  index, 
  eventSlug 
}: { 
  imagePath: string; 
  index: number;
  eventSlug?: string;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (eventSlug) {
      navigate(`/evento/${eventSlug}`);
    }
  };

  return (
    <div
      className={`embla__slide flex-[0_0_100%] min-w-0 relative h-full bg-black ${
        eventSlug ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <img
        src={imagePath}
        alt={`Banner ${index + 1}`}
        className="w-full h-full object-cover"
        style={{ 
          display: 'block',
          objectFit: 'cover'
        }}
        loading={index === 0 ? "eager" : "lazy"}
      />
    </div>
  );
};

const HeroCarousel = () => {
  const isMobile = useIsMobile();
  const { events } = useEvents();
  
  // Memoriza o array de banners para evitar re-renders desnecessários
  const bannersWithEvents = useMemo(() => {
    return events
      .filter((event) => event.image)
      .map((event) => {
        const desktopPath = fixImagePath(event.image);
        const finalPath = getMobileBanner(desktopPath, isMobile);
        return {
          image: finalPath,
          slug: event.slug,
          title: event.title
        };
      });
  }, [events, isMobile]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (bannersWithEvents.length === 0) return null;

  // Aspect ratio: desktop 2/1, mobile 956/600 (aproximadamente 1.593/1)
  const aspectRatio = isMobile ? '956/600' : '2/1';

  return (
    <section className="relative w-full overflow-hidden" style={{ aspectRatio }}>
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {bannersWithEvents.map((bannerData, index) => {
            const imagePath = bannerData.image.startsWith('/') ? bannerData.image : `/${bannerData.image}`;
            
            return (
              <CarouselSlide 
                key={`${bannerData.image}-${index}`}
                imagePath={imagePath}
                index={index}
                eventSlug={bannerData.slug}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannersWithEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
