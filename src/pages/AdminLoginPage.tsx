import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";
import { ADMIN_LOGOUT_REASON_KEY } from "@/lib/site-config";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin?tab=events", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(ADMIN_LOGOUT_REASON_KEY) === "inactive") {
        sessionStorage.removeItem(ADMIN_LOGOUT_REASON_KEY);
        toast({
          title: "Sessao encerrada",
          description: "Voce ficou inativo por muito tempo. Faca login novamente.",
        });
      }
    } catch {
      // Ignore storage errors
    }
  }, [toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatorios",
        description: "Preencha o e-mail e a senha.",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(email.trim(), password);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo.",
      });
      navigate("/admin?tab=events", { replace: true });
    } catch (error) {
      toast({
        title: "Nao foi possivel entrar",
        description:
          error instanceof Error ? error.message : "Verifique o e-mail e a senha.",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-16 lg:pt-20 flex-1">
        <section className="relative py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Area Administrativa
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Faca login para acessar o painel de administracao.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full hero-gradient flex items-center justify-center mb-4">
                    <LogIn className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Login Administrativo</CardTitle>
                  <CardDescription>Insira suas credenciais para continuar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Digite seu e-mail"
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Digite sua senha"
                        autoComplete="current-password"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
