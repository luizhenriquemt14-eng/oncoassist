import type { Speaker } from "@/types/site";
import { OptimizedImage } from "./OptimizedImage";

interface SpeakerCardProps {
  speaker: Speaker;
}

const SpeakerCard = ({ speaker }: SpeakerCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group">
      <div className="aspect-square overflow-hidden bg-muted">
        <OptimizedImage
          src={speaker.image}
          alt={speaker.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallback="/placeholder.svg"
        />
      </div>
      <div className="p-5">
        <h4 className="font-display text-lg font-semibold text-foreground mb-1">
          {speaker.name}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {speaker.role}
        </p>
      </div>
    </div>
  );
};

export default SpeakerCard;
