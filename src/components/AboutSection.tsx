import ProfessionalsSection from "./ProfessionalsSection";

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 lg:py-28 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Sobre Nós
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Sobre a <span className="text-gradient">OncoAssist</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Na OncoAssist, somos um time de oncologistas comprometidos em oferecer uma assistência oncológica integral, humanizada e baseada em ciência. Acreditamos que o cuidado com o paciente com câncer vai muito além do tratamento da doença — envolve escuta, empatia, conhecimento técnico e acompanhamento contínuo em todas as etapas da jornada.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            Nossa missão é entregar um cuidado horizontal e colaborativo, no qual o paciente é protagonista e cada decisão é compartilhada de forma clara e responsável. Trabalhamos com excelência clínica, atualização constante e uma abordagem individualizada, reconhecendo a singularidade de cada história, diagnóstico e necessidade.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            Na OncoAssist, cada paciente é cuidado com dedicação, respeito e propósito — unindo ciência, sensibilidade e experiência para transformar o tratamento oncológico em um caminho mais leve, seguro e humano.
          </p>
        </div>

        {/* Professionals Section */}
        <ProfessionalsSection />
      </div>
    </section>
  );
};

export default AboutSection;
