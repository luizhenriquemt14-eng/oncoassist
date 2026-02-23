import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { insuranceLocations } from "@/data/insurances";

const InsuranceSection = () => {
  return (
    <section id="convenios" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Convênios
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Convênios Atendidos
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Confira os convênios aceitos em cada unidade de atendimento
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue={insuranceLocations[0].locationName} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-auto mb-8">
              {insuranceLocations.map((location) => (
                <TabsTrigger
                  key={location.locationName}
                  value={location.locationName}
                  className="whitespace-normal text-left py-3 px-4 text-sm"
                >
                  {location.locationName}
                </TabsTrigger>
              ))}
            </TabsList>

            {insuranceLocations.map((location) => (
              <TabsContent
                key={location.locationName}
                value={location.locationName}
                className="mt-6"
              >
                <div className="bg-card rounded-xl p-8 card-shadow">
                  <h3 className="font-display text-2xl font-semibold mb-6 text-brand-blue">
                    {location.locationName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {location.insurances.map((insurance, index) => (
                      <div
                        key={index}
                        className="bg-muted/50 rounded-lg p-4 text-center hover:bg-muted transition-colors"
                      >
                        <p className="font-medium text-foreground">{insurance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default InsuranceSection;
