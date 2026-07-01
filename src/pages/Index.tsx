import SEO from "@/components/SEO";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import AboutSection from "@/components/AboutSection";
import LocationsSection from "@/components/LocationsSection";
import InsuranceSection from "@/components/InsuranceSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="OncoAssist - Eventos Científicos em Oncologia"
        description="OncoAssist é especializada na organização de eventos científicos em oncologia. Congressos, simpósios e workshops com os melhores especialistas do Brasil."
        keywords="oncologia, eventos médicos, congressos, simpósios, câncer, tratamento oncológico, educação médica, Grand Rounds"
        url="/"
      />
      <Header />
      <main className="pt-16 lg:pt-20">
        <HeroCarousel />
        <AboutSection />
        <LocationsSection />
        <InsuranceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
