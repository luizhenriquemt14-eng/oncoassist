export interface Professional {
  id: string;
  name: string;
  photo: string;
  curriculum: string[];
  locations: {
    name: string;
    mapsLink: string;
  }[];
}

export const professionals: Professional[] = [
  {
    id: "mariana-cartaxo",
    name: "Mariana Cartaxo Alves",
    photo: "/profissionais/Mariana Cartaxo Alves.jpeg",
    curriculum: [
      "Oncologista Clínica e Oncogeneticista.",
      "Residência em Oncologia Clínica pelo Instituto Brasileiro de Controle do Câncer em São Paulo.",
      "Mestra em Oncologia pela Faculdade de Medicina do ABC",
      "Doutora em Oncogenética pelo Instituto de Ensino e Pesquisa do Hospital Sírio-Libanês",
      "Aperfeiçoamento em Oncogenética pelo Hospital Sírio-Libanês e City of Hope Medical Center.",
      "Membro da Sociedade Brasileira de Oncologia Clínica (SBOC)"
    ],
    locations: [
      {
        name: "HNSN Consultorios",
        mapsLink: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x7acc300208b51a5:0x7c1bfccf88db659f?entry=s&sa=X&ved=2ahUKEwj59LWOlY6SAxUOI7kGHTXYHsQQ4kB6BAgEEAA&hl=pt"
      },
      {
        name: "Neves Medicina Diagnóstico",
        mapsLink: "https://maps.app.goo.gl/oSqSyYAmAesoVLfLA?g_st=iwb"
      },
      {
        name: "Unidade de Oncologia da Unimed",
        mapsLink: "https://maps.app.goo.gl/XUaYyBpjHL3mpndc7?g_st=iwb"
      },
      {
        name: "Consultórios COPA",
        mapsLink: "https://maps.app.goo.gl/dWpq4SzMSFNZrHbw5?g_st=iwb"
      }
    ]
  },
  {
    id: "marianna-oliveira",
    name: "Marianna Oliveira",
    photo: "/profissionais/Marianna Oliveira.jpg",
    curriculum: [
      "Residência em Oncologia Clínica pela Beneficência Portuguesa de São Paulo",
      "Especialização em Cuidados Paliativos pela Universidade de Pernambuco",
      "Membro da Sociedade Brasileira de Oncologia Clínica (SBOC)",
      "Diretora Técnica do Hospital Geral e do Câncer"
    ],
    locations: [
      {
        name: "HNSN Consultorios",
        mapsLink: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x7acc300208b51a5:0x7c1bfccf88db659f?entry=s&sa=X&ved=2ahUKEwj59LWOlY6SAxUOI7kGHTXYHsQQ4kB6BAgEEAA&hl=pt"
      },
      {
        name: "Neves Medicina Diagnóstico",
        mapsLink: "https://maps.app.goo.gl/oSqSyYAmAesoVLfLA?g_st=iwb"
      },
      {
        name: "Clioncol",
        mapsLink: "https://maps.app.goo.gl/TCtPmjNzgb9wnErA8?g_st=iwb"
      }
    ]
  },
  {
    id: "luiz-victor",
    name: "Luiz Victor Loureiro",
    photo: "/profissionais/Luiz Victor Loureiro.jpg",
    curriculum: [
      "Residência em Oncologia Clínica pelo Hospital Israelita Albert Einstein",
      "Professor do Departamento de Medicina Interna da Universidade Federal da Paraíba",
      "Doutor em ciências pela Universidade Federal de São Paulo",
      "Membro da Sociedade Europeia de Oncologia (ESMO)",
      "Membro e Especialista pela Sociedade Brasileira de Oncologia Clínica (SBOC)",
      "Corresponding member of American Society of Clinical Oncology (ASCO)"
    ],
    locations: [
      {
        name: "HNSN Consultorios",
        mapsLink: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x7acc300208b51a5:0x7c1bfccf88db659f?entry=s&sa=X&ved=2ahUKEwj59LWOlY6SAxUOI7kGHTXYHsQQ4kB6BAgEEAA&hl=pt"
      },
      {
        name: "Neves Medicina Diagnóstico",
        mapsLink: "https://maps.app.goo.gl/oSqSyYAmAesoVLfLA?g_st=iwb"
      },
      {
        name: "Unidade de Oncologia da Unimed",
        mapsLink: "https://maps.app.goo.gl/XUaYyBpjHL3mpndc7?g_st=iwb"
      },
      {
        name: "Consultórios COPA",
        mapsLink: "https://maps.app.goo.gl/dWpq4SzMSFNZrHbw5?g_st=iwb"
      },
      {
        name: "Clioncol",
        mapsLink: "https://maps.app.goo.gl/TCtPmjNzgb9wnErA8?g_st=iwb"
      }
    ]
  }
];
