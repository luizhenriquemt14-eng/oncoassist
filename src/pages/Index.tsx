import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import AboutSection from "@/components/AboutSection";
import LocationsSection from "@/components/LocationsSection";
import InsuranceSection from "@/components/InsuranceSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
