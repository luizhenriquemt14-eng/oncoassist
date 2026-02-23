import { useState } from "react";
import { OptimizedImage } from "./OptimizedImage";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { MapPin, ExternalLink } from "lucide-react";
import { professionals, Professional } from "@/data/professionals";

interface ProfessionalCardProps {
  professional: Professional;
  onLearnMore: (professional: Professional) => void;
}

const ProfessionalCard = ({ professional, onLearnMore }: ProfessionalCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group text-center">
      <div className="aspect-square overflow-hidden bg-muted">
        <OptimizedImage
          src={professional.photo}
          alt={professional.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallback="/placeholder.svg"
        />
      </div>
      <div className="p-6">
        <h4 className="font-display text-lg font-semibold text-foreground mb-4">
          {professional.name}
        </h4>
        <Button
          onClick={() => onLearnMore(professional)}
          variant="outline"
          className="w-full"
        >
          SAIBA MAIS
        </Button>
      </div>
    </div>
  );
};

const ProfessionalDialog = ({
  professional,
  isOpen,
  onClose,
}: {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!professional) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold">
            {professional.name}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="space-y-6 mt-4">
            {/* Curriculum */}
            {professional.curriculum.length > 0 && !professional.curriculum.includes("Pendente") && (
              <div>
                <h3 className="font-display font-semibold text-lg mb-3 text-brand-blue">
                  Currículo
                </h3>
                <ul className="space-y-2">
                  {professional.curriculum.map((item, index) => (
                    <li key={index} className="text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-primary mt-1.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Locations */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-3 text-brand-blue">
                Locais de Atendimento
              </h3>
              <ul className="space-y-3">
                {professional.locations.map((location, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-1">{location.name}</p>
                      <a
                        href={location.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                      >
                        Ver no Google Maps
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

const ProfessionalsSection = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLearnMore = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProfessional(null);
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nossa Equipe
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Conheça os profissionais que fazem parte da OncoAssist
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onLearnMore={handleLearnMore}
            />
          ))}
        </div>

        <ProfessionalDialog
          professional={selectedProfessional}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
        />
      </div>
    </section>
  );
};

export default ProfessionalsSection;
