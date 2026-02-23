import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Send } from "lucide-react";
import { saveToGoogleSheets } from "@/lib/googleSheets";

interface EventRegistrationFormProps {
  eventTitle: string;
  eventSlug: string;
}

const EventRegistrationForm = ({ eventTitle, eventSlug }: EventRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData({ ...formData, phone: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Salvar dados no Google Sheets
      await saveToGoogleSheets({
        tipo: 'event-registration',
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        evento: eventTitle,
        eventSlug: eventSlug,
      });

      toast({
        title: "Inscrição realizada com sucesso!",
        description: `Sua participação no evento "${eventTitle}" foi confirmada. Em breve entraremos em contato com todas as informações importantes.`,
      });

      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      toast({
        title: "Erro ao enviar inscrição",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="inscricao" className="bg-card rounded-2xl p-6 lg:p-8 card-shadow">
      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
        Garanta sua participação
      </h3>
      <p className="text-muted-foreground mb-6">
        Preencha o formulário abaixo para garantir de forma gratuita a sua vaga.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <Button
          type="submit"
          variant="cta"
          size="xl"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            "Enviando..."
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Confirmar Inscrição
            </>
          )}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-4">
        Ao se inscrever, você concorda com nossa política de privacidade. Seus dados são tratados com total respeito e segurança.
      </p>
    </div>
  );
};

export default EventRegistrationForm;
