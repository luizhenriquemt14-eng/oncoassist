import { useState } from "react";
import { Mail, Phone, Send, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveToGoogleSheets } from "@/lib/googleSheets";
import {
  PUBLIC_FORM_MIN_FILL_MS,
  PUBLIC_FORM_RATE_LIMIT_MS,
} from "@/lib/site-config";

interface EventRegistrationFormProps {
  eventTitle: string;
  eventSlug: string;
}

const LAST_SUBMIT_KEY = "oncoassist-last-public-form-submit";
const CLIENT_ID_KEY = "oncoassist-public-form-client-id";
const FORM_VERSION = "2026-06-28";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhone = (value: string) => value.replace(/\D/g, "").length >= 10;

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const getLastSubmit = () => {
  try {
    const value = Number(sessionStorage.getItem(LAST_SUBMIT_KEY));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
};

const setLastSubmit = (timestamp: number) => {
  try {
    sessionStorage.setItem(LAST_SUBMIT_KEY, String(timestamp));
  } catch {
    // Ignore storage errors
  }
};

const createClientId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getClientId = () => {
  try {
    const existingValue = localStorage.getItem(CLIENT_ID_KEY);
    if (existingValue) {
      return existingValue;
    }

    const newValue = createClientId();
    localStorage.setItem(CLIENT_ID_KEY, newValue);
    return newValue;
  } catch {
    return createClientId();
  }
};

const EventRegistrationForm = ({ eventTitle, eventSlug }: EventRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    website: "",
  });
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", specialty: "", website: "" });
    setStartedAt(Date.now());
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "phone" ? formatPhone(value) : value,
    }));
  };

  const handleSpecialtyChange = (value: string) => {
    setFormData((current) => ({
      ...current,
      specialty: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const submittedAt = Date.now();
    const elapsedMs = submittedAt - startedAt;
    const submissionId = createClientId();
    const clientId = getClientId();

    if (formData.website.trim()) {
      resetForm();
      toast({
        title: "Solicitacao enviada com sucesso!",
        description: `Recebemos seu interesse no evento "${eventTitle}". Nossa equipe entrara em contato para confirmar a vaga.`,
      });
      return;
    }

    if (submittedAt - getLastSubmit() < PUBLIC_FORM_RATE_LIMIT_MS) {
      toast({
        title: "Aguarde um instante",
        description: "Espere alguns segundos antes de enviar novamente.",
        variant: "destructive",
      });
      return;
    }

    if (elapsedMs < PUBLIC_FORM_MIN_FILL_MS) {
      toast({
        title: "Confirme os dados",
        description: "Revise o formulario e tente novamente em alguns segundos.",
        variant: "destructive",
      });
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const specialty = formData.specialty.trim();

    if (!name || !email || !phone || !specialty) {
      toast({
        title: "Campos obrigatorios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "E-mail invalido",
        description: "Informe um e-mail valido para concluir a inscricao.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPhone(phone)) {
      toast({
        title: "Celular invalido",
        description: "Informe um telefone com DDD para concluir a inscricao.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await saveToGoogleSheets({
        tipo: "event-registration",
        nome: name,
        email,
        telefone: phone,
        especialidade: specialty,
        evento: eventTitle,
        eventSlug,
        antiSpam: {
          honeypot: formData.website,
          startedAt: new Date(startedAt).toISOString(),
          submittedAt: new Date(submittedAt).toISOString(),
          elapsedMs,
          origin: window.location.origin,
          path: window.location.pathname,
          referrer: document.referrer,
          userAgent: window.navigator.userAgent,
          language: window.navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen: `${window.screen.width}x${window.screen.height}`,
          clientId,
          submissionId,
          formVersion: FORM_VERSION,
        },
      });

      setLastSubmit(submittedAt);
      toast({
        title: "Solicitacao enviada com sucesso!",
        description: `Recebemos seu interesse no evento "${eventTitle}". Nossa equipe entrara em contato para confirmar a vaga.`,
      });
      resetForm();
    } catch (error) {
      toast({
        title: "Erro ao enviar inscricao",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="inscricao" className="bg-card rounded-2xl p-6 lg:p-8 card-shadow">
      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
        Solicite sua participacao
      </h3>
      <p className="text-muted-foreground mb-6">
        Preencha o formulario abaixo para se candidatar gratuitamente. Nossa equipe entrara em contato para confirmar sua vaga.
      </p>
      <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground mb-6">
        As vagas sao limitadas por especialidade e a confirmacao sera feita pela nossa equipe.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground font-medium">
            Nome completo *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              className="pl-11 h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">
            E-mail *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-11 h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground font-medium">
            Celular *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="pl-11 h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty" className="text-foreground font-medium">
            Especialidade *
          </Label>
          <Select value={formData.specialty} onValueChange={handleSpecialtyChange}>
            <SelectTrigger id="specialty" className="h-12">
              <SelectValue placeholder="Selecione sua especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Enfermeiro(a)">Enfermeiros</SelectItem>
              <SelectItem value="Nutricionista">Nutricionistas</SelectItem>
              <SelectItem value="Farmaceutico(a)">Farmaceuticos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" variant="cta" size="xl" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? (
            "Enviando..."
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Solicitar Inscricao
            </>
          )}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-4">
        Ao se inscrever, voce concorda com nossa politica de privacidade.
      </p>
    </div>
  );
};

export default EventRegistrationForm;
