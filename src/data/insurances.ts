export interface InsuranceLocation {
  locationName: string;
  insurances: string[];
}

export const insuranceLocations: InsuranceLocation[] = [
  {
    locationName: "HNSN Rede D'Or - Oncologia D'Or",
    insurances: [
      "GEAP",
      "AFRAFEP",
      "CAMED",
      "CAIXA SAUDE",
      "PLAN ASSISTE",
      "BRADESCO",
      "MEDISERVICE",
      "SULAMERICA",
      "FUSMA",
      "FUSEX",
      "SAUDE PETROBRAS",
      "STELLANTIS"
    ]
  },
  {
    locationName: "Neves Medicina Diagnóstico",
    insurances: [
      "GEAP",
      "AFRAFEP",
      "CAMED",
      "CAIXA SAUDE",
      "PLAN ASSISTE",
      "BRADESCO",
      "MEDISERVICE",
      "SULAMERICA",
      "FUSMA",
      "FUSEX",
      "SAUDE PETROBRAS",
      "STELLANTIS"
    ]
  },
  {
    locationName: "Clioncol",
    insurances: [
      "Unimed",
      "GEAP",
      "CASSI",
      "BRADESCO",
      "MEDISERVICE",
      "FUNASA",
      "CAPESAUDE",
      "ASSEFAZ SAUDE"
    ]
  },
  {
    locationName: "Unidade de Oncologia da Unimed",
    insurances: [
      "UNIMED"
    ]
  },
  {
    locationName: "COPA",
    insurances: [
      "Particular"
    ]
  }
];
