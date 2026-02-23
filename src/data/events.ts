export interface Speaker {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speaker: string | null;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  time: string;
  location: string;
  address: string;
  city: string;
  state: string;
  targetAudience: string;
  objective: string;
  image: string;
  speakers: Speaker[];
  schedule?: ScheduleItem[];
}

export const AVAILABLE_BANNERS = [
  "/banners/Tumores Gastrointestinais.webp",
  "/banners/Tumores Geniturinários.webp",
  "/banners/banner_hematologia.webp",
  "/banners/banner_multiprofissional.webp",
  "/banners/banner_torax.webp",
  "/banners/banner_mama.webp",
  "/banners/banner_medicina_intensiva.webp",
  "/banners/banner_tumores_ginecologicos.webp",
];

export const events: Event[] = [
  {
    id: "tumores-gastrointestinais",
    slug: "tumores-gastrointestinais",
    title: "Grand Rounds – Tumores Gastrointestinais",
    shortDescription: "Atualização em tumores do trato digestivo com foco em diagnóstico precoce, terapias personalizadas e manejo multidisciplinar.",
    fullDescription: "O Grand Rounds de Tumores Gastrointestinais reúne especialistas de referência para a discussão aprofundada de casos clínicos desafiadores e atualização nas mais recentes evidências relacionadas às neoplasias do sistema digestivo.\n\nSerão apresentados casos reais com análise multidisciplinar, contemplando estratégias cirúrgicas oncológicas, técnicas modernas de radioterapia, quimioterapia sistêmica, terapias-alvo e imunoterapia, sempre com foco na individualização do tratamento.\n\nCom abordagem prática e fundamentada em evidências científicas, o encontro promove a integração entre as diferentes especialidades envolvidas no cuidado do paciente oncológico, fortalecendo a tomada de decisão compartilhada e a excelência no manejo dos tumores gastrointestinais.",
    date: "14/03/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience: "Oncologistas clínicos, cirurgiões do aparelho digestivo, cirurgiões oncológicos, gastroenterologistas, hepatologistas, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective: "Atualizar conhecimentos sobre diagnóstico precoce, biomarcadores moleculares e tratamento multidisciplinar de tumores gastrointestinais, discutir casos clínicos complexos e promover integração entre as especialidades envolvidas no cuidado oncológico digestivo.",
    image: "/banners/Tumores Gastrointestinais.webp",
    speakers: [
      {
        id: "mariana-cartaxo",
        name: "Dra. Mariana Cartaxo Alves",
        role: "Oncologista Clínica e Oncogeneticista",
        image: "/profissionais/Mariana Cartaxo Alves.jpeg"
      },
      {
        id: "marianna-oliveira",
        name: "Dra. Marianna Oliveira",
        role: "Oncologista Clínica",
        image: "/profissionais/Marianna Oliveira.jpg"
      },
      {
        id: "luiz-victor",
        name: "Dr. Luiz Victor Loureiro",
        role: "Oncologista Clínico",
        image: "/profissionais/Luiz Victor Loureiro.jpg"
      }
    ],
    schedule: [
      {
        time: "08:00 - 08:30",
        title: "Credenciamento e Coffee Break",
        speaker: null
      },
      {
        time: "08:30 - 09:00",
        title: "Abertura e Boas-vindas",
        speaker: null
      },
      {
        time: "09:00 - 10:00",
        title: "Tema 1",
        speaker: null
      },
      {
        time: "10:00 - 10:15",
        title: "Intervalo",
        speaker: null
      },
      {
        time: "10:15 - 11:15",
        title: "Tema 2",
        speaker: null
      },
      {
        time: "11:15 - 12:00",
        title: "Discussão de Casos Clínicos",
        speaker: null
      }
    ],
  },
  {
    id: "tumores-geniturinarios",
    slug: "tumores-geniturinarios",
    title: "Grand Rounds – Tumores Geniturinários",
    shortDescription: "Discussão de casos complexos em oncologia geniturinária com foco em medicina de precisão, terapias-alvo e imunoterapia.",
    fullDescription: "O Grand Rounds de Tumores Geniturinários reúne especialistas para discutir as mais recentes atualizações no diagnóstico, estadiamento e tratamento das neoplasias do trato geniturinário, com foco em decisões clínicas baseadas em evidências.\n\nO encontro abordará de forma abrangente o câncer de próstata em todos os seus estágios — doença localizada, localmente avançada e metastática — além de tumores renais (carcinoma de células claras e variantes não-claras), câncer de bexiga músculo-invasivo e não-músculo-invasivo, neoplasias do trato urinário superior (ureter e pelve renal) e tumores testiculares germinativos e não germinativos.\n\nPor meio da discussão de casos clínicos reais e da integração entre urologia, oncologia clínica, radioterapia, patologia e demais especialidades envolvidas, o evento proporciona uma atualização prática, multidisciplinar e alinhada às evidências científicas mais recentes no manejo dos tumores urológicos.",
    date: "21/04/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience: "Oncologistas clínicos, urologistas, uro-oncologistas, cirurgiões oncológicos, radioterapeutas, patologistas, geneticistas, enfermeiros oncológicos, residentes, equipe multiprofissional e estudantes de medicina",
    objective: "Atualizar conhecimentos sobre diagnóstico molecular, medicina de precisão e tratamento personalizado de tumores geniturinários, discutir casos clínicos complexos e promover integração multidisciplinar entre oncologia clínica e urologia oncológica.",
    image: "/banners/Tumores Geniturinários.webp",
    speakers: [
      {
        id: "mariana-cartaxo",
        name: "Dra. Mariana Cartaxo Alves",
        role: "Oncologista Clínica e Oncogeneticista",
        image: "/profissionais/Mariana Cartaxo Alves.jpeg"
      },
      {
        id: "marianna-oliveira",
        name: "Dra. Marianna Oliveira",
        role: "Oncologista Clínica",
        image: "/profissionais/Marianna Oliveira.jpg"
      },
      {
        id: "luiz-victor",
        name: "Dr. Luiz Victor Loureiro",
        role: "Oncologista Clínico",
        image: "/profissionais/Luiz Victor Loureiro.jpg"
      },
      {
        id: "convidado-surpresa",
        name: "Convidado Surpresa",
        role: "Em breve",
        image: "/placeholder.svg"
      }
    ],
  },
  {
    id: "hematologia",
    slug: "hematologia",
    title: "Grand Rounds – Hematologia",
    shortDescription: "Discussão de casos complexos em hematologia oncológica e atualizações em leucemias e linfomas.",
    fullDescription: "O Grand Rounds de Hematologia reúne hematologistas, oncologistas, patologistas e demais especialidades envolvidas no cuidado de pacientes onco-hematológicos para a discussão de casos complexos e atualização científica nas doenças hematológicas malignas.\n\nSerão abordados temas como leucemias agudas e crônicas, linfomas, mieloma múltiplo e síndromes mielodisplásicas, com apresentação de casos clínicos desafiadores que permitirão discutir diagnóstico diferencial, estratificação de risco e tomada de decisão terapêutica.\n\nO encontro também contemplará o manejo de complicações infecciosas, suporte transfusional e cuidados de suporte, reforçando a importância da atuação integrada da equipe multiprofissional. Com enfoque prático e fundamentado nas evidências científicas mais recentes, o evento visa fortalecer a discussão multidisciplinar e aprimorar o cuidado ao paciente onco-hematológico.",
    date: "09/05/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience: "Hematologistas, oncologistas, patologistas, residentes e estudantes de medicina, equipe multiprofissional",
    objective: "Atualizar conhecimentos em hematologia oncológica, discutir casos complexos e promover integração entre especialidades relacionadas.",
    image: "/banners/banner_hematologia.webp",
    speakers: [
      {
        id: "mariana-cartaxo",
        name: "Dra. Mariana Cartaxo Alves",
        role: "Oncologista Clínica e Oncogeneticista",
        image: "/profissionais/Mariana Cartaxo Alves.jpeg"
      },
      {
        id: "marianna-oliveira",
        name: "Dra. Marianna Oliveira",
        role: "Oncologista Clínica",
        image: "/profissionais/Marianna Oliveira.jpg"
      },
      {
        id: "luiz-victor",
        name: "Dr. Luiz Victor Loureiro",
        role: "Oncologista Clínico",
        image: "/profissionais/Luiz Victor Loureiro.jpg"
      },
      {
        id: "carolina-rolo",
        name: "Dra. Carolina Rolo",
        role: "Hematologista",
        image: "/placeholder.svg"
      }
    ],
  },
  {
    id: "multiprofissional",
    slug: "multiprofissional",
    title: "Grand Rounds – Multiprofissional",
    shortDescription: "Encontro multidisciplinar abordando cuidados integrados ao paciente oncológico.",
    fullDescription: "O Grand Rounds Multiprofissional é um encontro dedicado ao cuidado integral do paciente oncológico, reunindo diferentes áreas da assistência para uma discussão ampla, prática e centrada na pessoa.\n\nSerão abordados temas como comunicação em oncologia, cuidados paliativos, reabilitação oncológica, nutrição, psicologia oncológica e farmacologia clínica. Casos clínicos reais serão analisados sob múltiplas perspectivas, evidenciando como cada profissional contribui de forma essencial para a qualidade do cuidado.\n\nO evento promove a integração entre médicos, enfermeiros, farmacêuticos, nutricionistas, psicólogos, fisioterapeutas e demais profissionais envolvidos na jornada do paciente com câncer, reforçando a importância de uma abordagem multidisciplinar, humanizada e baseada em evidências.",
    date: "20/07/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience: "Médicos, enfermeiros, farmacêuticos, nutricionistas, psicólogos, fisioterapeutas, assistentes sociais, residentes, equipe multiprofissional e estudantes de medicina",
    objective: "Promover integração multidisciplinar, discutir cuidados integrados ao paciente oncológico e fortalecer o trabalho em equipe na prática clínica.",
    image: "/banners/banner_multiprofissional.webp",
    speakers: [
      {
        id: "mariana-cartaxo",
        name: "Dra. Mariana Cartaxo Alves",
        role: "Oncologista Clínica e Oncogeneticista",
        image: "/profissionais/Mariana Cartaxo Alves.jpeg"
      },
      {
        id: "marianna-oliveira",
        name: "Dra. Marianna Oliveira",
        role: "Oncologista Clínica",
        image: "/profissionais/Marianna Oliveira.jpg"
      },
      {
        id: "luiz-victor",
        name: "Dr. Luiz Victor Loureiro",
        role: "Oncologista Clínico",
        image: "/profissionais/Luiz Victor Loureiro.jpg"
      },
      {
        id: "convidado-surpresa",
        name: "Convidado Surpresa",
        role: "Em breve",
        image: "/placeholder.svg"
      }
    ],
  },
  {
    id: "torax",
    slug: "torax",
    title: "Grand Rounds – Tórax",
    shortDescription: "Atualização em câncer de pulmão e tumores do tórax com foco em medicina de precisão.",
    fullDescription: "O Grand Rounds de Tórax é dedicado à atualização e discussão dos principais avanços no manejo do câncer de pulmão e de outros tumores torácicos, com especial ênfase em medicina de precisão e terapias personalizadas.\n\nSerão apresentados casos clínicos desafiadores, permitindo a análise multidisciplinar de estratégias diagnósticas, testes moleculares, definição de biomarcadores, indicação de terapias-alvo, imunoterapia, radioterapia e abordagens cirúrgicas. A discussão contemplará tanto doença inicial quanto localmente avançada e metastática, sempre com foco na individualização do tratamento.\n\nCom abordagem prática e fundamentada nas evidências científicas mais recentes, o encontro visa promover a integração entre oncologia clínica, pneumologia, cirurgia torácica, radioterapia, patologia e demais especialidades envolvidas, fortalecendo a tomada de decisão e aprimorando o cuidado ao paciente com tumores torácicos.",
    date: "15/08/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience: "Oncologistas clínicos, cirurgiões torácicos, pneumologistas, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective: "Atualizar conhecimentos sobre diagnóstico molecular, terapias personalizadas e tratamento de tumores torácicos baseado em evidências científicas.",
    image: "/banners/banner_torax.webp",
    speakers: [
      {
        id: "mariana-cartaxo",
        name: "Dra. Mariana Cartaxo Alves",
        role: "Oncologista Clínica e Oncogeneticista",
        image: "/profissionais/Mariana Cartaxo Alves.jpeg"
      },
      {
        id: "marianna-oliveira",
        name: "Dra. Marianna Oliveira",
        role: "Oncologista Clínica",
        image: "/profissionais/Marianna Oliveira.jpg"
      },
      {
        id: "luiz-victor",
        name: "Dr. Luiz Victor Loureiro",
        role: "Oncologista Clínico",
        image: "/profissionais/Luiz Victor Loureiro.jpg"
      },
      {
        id: "convidado-surpresa",
        name: "Convidado Surpresa",
        role: "Em breve",
        image: "/placeholder.svg"
      }
    ],
  },
  {
    id: "mama",
    slug: "mama",
    title: "Grand Rounds – Mama",
    shortDescription: "Discussão de casos de câncer de mama com foco em tratamento personalizado e medicina de precisão.",
    fullDescription: "O Grand Rounds de Mama reúne especialistas para a discussão aprofundada de casos complexos de câncer de mama e das mais recentes atualizações terapêuticas, com foco na prática clínica baseada em evidências.\n\nO encontro abordará os diferentes subtipos moleculares, biomarcadores preditivos e prognósticos, terapias-alvo, imunoterapia e estratégias de tratamento neoadjuvante e adjuvante, além de estratégias cirúrgicas e de radioterapia. Casos clínicos reais ilustrarão a importância do perfil molecular na tomada de decisão, incluindo discussões sobre câncer de mama triplo negativo, HER2-positivo e hormônio-sensível.\n\nTambém serão debatidas condutas no cuidado multidisciplinar e integral da paciente, com foco na qualidade de vida, manejo de toxicidades e seguimento a longo prazo.\n\nCom abordagem multidisciplinar e prática, o evento visa fortalecer a integração entre as especialidades envolvidas e promover atualização científica de excelência no cuidado às pacientes com câncer de mama.",
    date: "12/09/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience: "Oncologistas clínicos, mastologistas, cirurgiões plásticos, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective: "Atualizar profissionais sobre tratamento personalizado do câncer de mama, discutir casos complexos e promover abordagem multidisciplinar.",
    image: "/banners/banner_mama.webp",
    speakers: [
      {
        id: "mariana-cartaxo",
        name: "Dra. Mariana Cartaxo Alves",
        role: "Oncologista Clínica e Oncogeneticista",
        image: "/profissionais/Mariana Cartaxo Alves.jpeg"
      },
      {
        id: "marianna-oliveira",
        name: "Dra. Marianna Oliveira",
        role: "Oncologista Clínica",
        image: "/profissionais/Marianna Oliveira.jpg"
      },
      {
        id: "luiz-victor",
        name: "Dr. Luiz Victor Loureiro",
        role: "Oncologista Clínico",
        image: "/profissionais/Luiz Victor Loureiro.jpg"
      },
      {
        id: "convidado-surpresa",
        name: "Convidado Surpresa",
        role: "Em breve",
        image: "/placeholder.svg"
      }
    ],
  },
  {
    id: "medicina-intensiva",
    slug: "medicina-intensiva",
    title: "Grand Rounds – Medicina Intensiva",
    shortDescription: "Suporte intensivo ao paciente oncológico: complicações agudas e cuidados críticos.",
    fullDescription: "O Grand Rounds de Medicina Intensiva em Oncologia é dedicado ao manejo de complicações agudas e aos cuidados críticos em pacientes oncológicos, com foco na tomada de decisão baseada em evidências e na integração entre especialidades.\n\nO encontro abordará as principais urgências oncológicas, sepse em pacientes imunossuprimidos, insuficiência respiratória, síndrome do desconforto respiratório agudo (SDRA) e manejo da dor oncológica em contexto crítico. Casos clínicos reais servirão como base para discussão de condutas, prognóstico e critérios de admissão e permanência em terapia intensiva.\n\nTambém serão discutidos aspectos éticos e comunicacionais, incluindo diálogo com familiares, planejamento terapêutico proporcional e decisões de fim de vida.\n\nCom abordagem prática e multidisciplinar, o evento visa atualizar intensivistas e oncologistas, promovendo alinhamento assistencial e aprimorando o cuidado ao paciente oncológico em situação crítica.",
    date: "24/10/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience: "Intensivistas, oncologistas, emergencistas, anestesiologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective: "Atualizar conhecimentos sobre manejo de complicações agudas em pacientes oncológicos e promover integração entre medicina intensiva e oncologia.",
    image: "/banners/banner_medicina_intensiva.webp",
    speakers: [
      {
        id: "mariana-cartaxo",
        name: "Dra. Mariana Cartaxo Alves",
        role: "Oncologista Clínica e Oncogeneticista",
        image: "/profissionais/Mariana Cartaxo Alves.jpeg"
      },
      {
        id: "marianna-oliveira",
        name: "Dra. Marianna Oliveira",
        role: "Oncologista Clínica",
        image: "/profissionais/Marianna Oliveira.jpg"
      },
      {
        id: "luiz-victor",
        name: "Dr. Luiz Victor Loureiro",
        role: "Oncologista Clínico",
        image: "/profissionais/Luiz Victor Loureiro.jpg"
      },
      {
        id: "convidado-surpresa",
        name: "Convidado Surpresa",
        role: "Em breve",
        image: "/placeholder.svg"
      }
    ],
  },
  {
    id: "tumores-ginecologicos",
    slug: "tumores-ginecologicos",
    title: "Grand Rounds – Tumores Ginecológicos",
    shortDescription: "Atualização em câncer ginecológico: ovário, colo do útero, endométrio e vulva.",
    fullDescription: "O Grand Rounds de Tumores Ginecológicos é dedicado às principais atualizações no diagnóstico, estadiamento e tratamento dos cânceres ginecológicos, com foco em decisões clínicas baseadas em evidências e na abordagem multidisciplinar.\n\nO encontro abordará câncer de ovário — incluindo estratégias cirúrgicas, quimioterapia intraperitoneal, terapias-alvo e tratamento de manutenção — além de casos de câncer de colo do útero, com discussão sobre abordagem cirúrgica, quimiorradioterapia e manejo da doença localmente avançada e metastática. Também serão discutidos câncer de endométrio, com ênfase nos subtipos moleculares e na personalização terapêutica, bem como câncer de vulva e vagina.\n\nSerão apresentados casos clínicos complexos que permitirão debate integrado entre ginecologistas oncologistas, oncologistas clínicos, radioterapeutas e patologistas. Temas como preservação de fertilidade, qualidade de vida, sexualidade e cuidados de suporte também farão parte da programação.\n\nCom abordagem prática e científica, o evento visa promover atualização de excelência e fortalecer a discussão multidisciplinar no cuidado às pacientes com tumores ginecológicos.",
    date: "14/11/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience: "Ginecologistas oncologistas, oncologistas clínicos, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective: "Atualizar profissionais sobre diagnóstico e tratamento de tumores ginecológicos, discutir casos complexos e promover abordagem multidisciplinar.",
    image: "/banners/banner_tumores_ginecologicos.webp",
    speakers: [
      {
        id: "mariana-cartaxo",
        name: "Dra. Mariana Cartaxo Alves",
        role: "Oncologista Clínica e Oncogeneticista",
        image: "/profissionais/Mariana Cartaxo Alves.jpeg"
      },
      {
        id: "marianna-oliveira",
        name: "Dra. Marianna Oliveira",
        role: "Oncologista Clínica",
        image: "/profissionais/Marianna Oliveira.jpg"
      },
      {
        id: "luiz-victor",
        name: "Dr. Luiz Victor Loureiro",
        role: "Oncologista Clínico",
        image: "/profissionais/Luiz Victor Loureiro.jpg"
      },
      {
        id: "convidado-surpresa",
        name: "Convidado Surpresa",
        role: "Em breve",
        image: "/placeholder.svg"
      }
    ],
  },
];
