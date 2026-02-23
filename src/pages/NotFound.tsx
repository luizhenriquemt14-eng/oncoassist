import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center px-4">
            <h1 className="mb-4 text-4xl md:text-5xl font-display font-bold text-foreground">404</h1>
            <p className="mb-4 text-xl text-muted-foreground">Página não encontrada</p>
            <p className="mb-8 text-muted-foreground">
              A página que você está procurando não existe ou foi movida.
            </p>
            <Link to="/">
              <Button>
                Voltar para Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
