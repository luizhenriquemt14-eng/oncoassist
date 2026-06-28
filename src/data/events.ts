import type { Event } from "@/types/site";

export type { Event, ScheduleItem, Speaker } from "@/types/site";

export const AVAILABLE_BANNERS = [
  "/banners/Tumores Gastrointestinais.webp",
  "/banners/Tumores Geniturinarios.webp",
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
    title: "Grand Rounds - Tumores Gastrointestinais",
    shortDescription:
      "Atualizacao em tumores do trato digestivo com foco em diagnostico precoce, terapias personalizadas e manejo multidisciplinar.",
    fullDescription:
      "O Grand Rounds de Tumores Gastrointestinais reune especialistas de referencia para a discussao aprofundada de casos clinicos desafiadores e atualizacao nas mais recentes evidencias relacionadas as neoplasias do sistema digestivo.\n\nSerao apresentados casos reais com analise multidisciplinar, contemplando estrategias cirurgicas oncologicas, tecnicas modernas de radioterapia, quimioterapia sistemica, terapias-alvo e imunoterapia, sempre com foco na individualizacao do tratamento.\n\nCom abordagem pratica e fundamentada em evidencias cientificas, o encontro promove a integracao entre as diferentes especialidades envolvidas no cuidado do paciente oncologico, fortalecendo a tomada de decisao compartilhada e a excelencia no manejo dos tumores gastrointestinais.",
    date: "14/03/2026",
    time: "08:00 as 12:00",
    location: "Verdegreen Hotel",
    address: "Av. Joao Mauricio, 255 - Manaira",
    city: "Joao Pessoa",
    state: "PB",
    targetAudience:
      "Oncologistas clinicos, cirurgioes do aparelho digestivo, cirurgioes oncologicos, gastroenterologistas, hepatologistas, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar conhecimentos sobre diagnostico precoce, biomarcadores moleculares e tratamento multidisciplinar de tumores gastrointestinais, discutir casos clinicos complexos e promover integracao entre as especialidades envolvidas no cuidado oncologico digestivo.",
    image: "/banners/Tumores Gastrointestinais.webp",
    speakers: [],
    schedule: [
      { time: "08:00 - 08:30", title: "Credenciamento e Coffee Break", speaker: null },
      { time: "08:30 - 09:00", title: "Abertura e Boas-vindas", speaker: null },
      { time: "09:00 - 10:00", title: "Tema 1", speaker: null },
      { time: "10:00 - 10:15", title: "Intervalo", speaker: null },
      { time: "10:15 - 11:15", title: "Tema 2", speaker: null },
      { time: "11:15 - 12:00", title: "Discussao de Casos Clinicos", speaker: null },
    ],
  },
  {
    id: "tumores-geniturinarios",
    slug: "tumores-geniturinarios",
    title: "Grand Rounds - Tumores Geniturinarios",
    shortDescription:
      "Discussao de casos complexos em oncologia geniturinaria com foco em medicina de precisao, terapias-alvo e imunoterapia.",
    fullDescription:
      "O Grand Rounds de Tumores Geniturinarios reune especialistas para discutir as mais recentes atualizacoes no diagnostico, estadiamento e tratamento das neoplasias do trato geniturinario, com foco em decisoes clinicas baseadas em evidencias.\n\nO encontro abordara de forma abrangente o cancer de prostata em todos os seus estagios, alem de tumores renais, cancer de bexiga e neoplasias do trato urinario superior.\n\nPor meio da discussao de casos clinicos reais e da integracao entre urologia, oncologia clinica, radioterapia, patologia e demais especialidades envolvidas, o evento proporciona uma atualizacao pratica, multidisciplinar e alinhada as evidencias cientificas mais recentes.",
    date: "21/04/2026",
    time: "08:00 as 12:00",
    location: "Verdegreen Hotel",
    address: "Av. Joao Mauricio, 255 - Manaira",
    city: "Joao Pessoa",
    state: "PB",
    targetAudience:
      "Oncologistas clinicos, urologistas, uro-oncologistas, cirurgioes oncologicos, radioterapeutas, patologistas, geneticistas, enfermeiros oncologicos, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar conhecimentos sobre diagnostico molecular, medicina de precisao e tratamento personalizado de tumores geniturinarios, discutir casos clinicos complexos e promover integracao multidisciplinar entre oncologia clinica e urologia oncologica.",
    image: "/banners/Tumores Geniturinarios.webp",
    speakers: [],
  },
  {
    id: "hematologia",
    slug: "hematologia",
    title: "Grand Rounds - Hematologia",
    shortDescription:
      "Discussao de casos complexos em hematologia oncologica e atualizacoes em leucemias e linfomas.",
    fullDescription:
      "O Grand Rounds de Hematologia reune hematologistas, oncologistas, patologistas e demais especialidades envolvidas no cuidado de pacientes onco-hematologicos para a discussao de casos complexos e atualizacao cientifica nas doencas hematologicas malignas.\n\nSerao abordados temas como leucemias agudas e cronicas, linfomas, mieloma multiplo e sindromes mielodisplasicas, com apresentacao de casos clinicos desafiadores.\n\nCom enfoque pratico e fundamentado nas evidencias cientificas mais recentes, o evento visa fortalecer a discussao multidisciplinar e aprimorar o cuidado ao paciente onco-hematologico.",
    date: "09/05/2026",
    time: "08:00 as 12:00",
    location: "Verdegreen Hotel",
    address: "Av. Joao Mauricio, 255 - Manaira",
    city: "Joao Pessoa",
    state: "PB",
    targetAudience:
      "Hematologistas, oncologistas, patologistas, residentes e estudantes de medicina, equipe multiprofissional",
    objective:
      "Atualizar conhecimentos em hematologia oncologica, discutir casos complexos e promover integracao entre especialidades relacionadas.",
    image: "/banners/banner_hematologia.webp",
    speakers: [],
  },
  {
    id: "multiprofissional",
    slug: "multiprofissional",
    title: "Grand Rounds - Multiprofissional",
    shortDescription:
      "Encontro multidisciplinar abordando cuidados integrados ao paciente oncologico.",
    fullDescription:
      "O Grand Rounds Multiprofissional e um encontro dedicado ao cuidado integral do paciente oncologico, reunindo diferentes areas da assistencia para uma discussao ampla, pratica e centrada na pessoa.\n\nSerao abordados temas como comunicacao em oncologia, cuidados paliativos, reabilitacao oncologica, nutricao, psicologia oncologica e farmacologia clinica.\n\nO evento promove a integracao entre medicos, enfermeiros, farmaceuticos, nutricionistas, psicologos, fisioterapeutas e demais profissionais envolvidos na jornada do paciente com cancer.",
    date: "20/07/2026",
    time: "08:00 as 12:00",
    location: "Verdegreen Hotel",
    address: "Av. Joao Mauricio, 255 - Manaira",
    city: "Joao Pessoa",
    state: "PB",
    targetAudience:
      "Medicos, enfermeiros, farmaceuticos, nutricionistas, psicologos, fisioterapeutas, assistentes sociais, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Promover integracao multidisciplinar, discutir cuidados integrados ao paciente oncologico e fortalecer o trabalho em equipe na pratica clinica.",
    image: "/banners/banner_multiprofissional.webp",
    speakers: [],
  },
  {
    id: "torax",
    slug: "torax",
    title: "Grand Rounds - Torax",
    shortDescription:
      "Atualizacao em cancer de pulmão e tumores do torax com foco em medicina de precisao.",
    fullDescription:
      "O Grand Rounds de Torax e dedicado a atualizacao e discussao dos principais avancos no manejo do cancer de pulmao e de outros tumores toracicos, com especial enfase em medicina de precisao e terapias personalizadas.\n\nSerao apresentados casos clinicos desafiadores, permitindo a analise multidisciplinar de estrategias diagnosticas, testes moleculares, definicao de biomarcadores, indicacao de terapias-alvo e imunoterapia.\n\nCom abordagem pratica e fundamentada nas evidencias cientificas mais recentes, o encontro visa promover a integracao entre oncologia clinica, pneumologia, cirurgia toracica, radioterapia e patologia.",
    date: "15/08/2026",
    time: "08:00 as 12:00",
    location: "Verdegreen Hotel",
    address: "Av. Joao Mauricio, 255 - Manaira",
    city: "Joao Pessoa",
    state: "PB",
    targetAudience:
      "Oncologistas clinicos, cirurgioes toracicos, pneumologistas, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar conhecimentos sobre diagnostico molecular, terapias personalizadas e tratamento de tumores toracicos baseado em evidencias cientificas.",
    image: "/banners/banner_torax.webp",
    speakers: [],
  },
  {
    id: "mama",
    slug: "mama",
    title: "Grand Rounds - Mama",
    shortDescription:
      "Discussao de casos de cancer de mama com foco em tratamento personalizado e medicina de precisao.",
    fullDescription:
      "O Grand Rounds de Mama reune especialistas para a discussao aprofundada de casos complexos de cancer de mama e das mais recentes atualizacoes terapeuticas, com foco na pratica clinica baseada em evidencias.\n\nO encontro abordara os diferentes subtipos moleculares, biomarcadores preditivos e prognosticos, terapias-alvo, imunoterapia e estrategias de tratamento neoadjuvante e adjuvante.\n\nCom abordagem multidisciplinar e pratica, o evento visa fortalecer a integracao entre as especialidades envolvidas e promover atualizacao cientifica de excelencia no cuidado as pacientes com cancer de mama.",
    date: "12/09/2026",
    time: "08:00 as 12:00",
    location: "Verdegreen Hotel",
    address: "Av. Joao Mauricio, 255 - Manaira",
    city: "Joao Pessoa",
    state: "PB",
    targetAudience:
      "Oncologistas clinicos, mastologistas, cirurgioes plasticos, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar profissionais sobre tratamento personalizado do cancer de mama, discutir casos complexos e promover abordagem multidisciplinar.",
    image: "/banners/banner_mama.webp",
    speakers: [],
  },
  {
    id: "medicina-intensiva",
    slug: "medicina-intensiva",
    title: "Grand Rounds - Medicina Intensiva",
    shortDescription:
      "Suporte intensivo ao paciente oncologico: complicacoes agudas e cuidados criticos.",
    fullDescription:
      "O Grand Rounds de Medicina Intensiva em Oncologia e dedicado ao manejo de complicacoes agudas e aos cuidados criticos em pacientes oncologicos, com foco na tomada de decisao baseada em evidencias e na integracao entre especialidades.\n\nO encontro abordara as principais urgencias oncologicas, sepse em pacientes imunossuprimidos, insuficiencia respiratoria e manejo da dor em contexto critico.\n\nCom abordagem pratica e multidisciplinar, o evento visa atualizar intensivistas e oncologistas, promovendo alinhamento assistencial e aprimorando o cuidado ao paciente oncologico em situacao critica.",
    date: "24/10/2026",
    time: "08:00 as 12:00",
    location: "Verdegreen Hotel",
    address: "Av. Joao Mauricio, 255 - Manaira",
    city: "Joao Pessoa",
    state: "PB",
    targetAudience:
      "Intensivistas, oncologistas, emergencistas, anestesiologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar conhecimentos sobre manejo de complicacoes agudas em pacientes oncologicos e promover integracao entre medicina intensiva e oncologia.",
    image: "/banners/banner_medicina_intensiva.webp",
    speakers: [],
  },
  {
    id: "tumores-ginecologicos",
    slug: "tumores-ginecologicos",
    title: "Grand Rounds - Tumores Ginecologicos",
    shortDescription:
      "Atualizacao em cancer ginecologico: ovario, colo do utero, endometrio e vulva.",
    fullDescription:
      "O Grand Rounds de Tumores Ginecologicos e dedicado as principais atualizacoes no diagnostico, estadiamento e tratamento dos canceres ginecologicos, com foco em decisoes clinicas baseadas em evidencias e na abordagem multidisciplinar.\n\nO encontro abordara cancer de ovario, colo do utero, endometrio, vulva e vagina, com apresentacao de casos clinicos complexos que permitirao debate integrado.\n\nCom abordagem pratica e cientifica, o evento visa promover atualizacao de excelencia e fortalecer a discussao multidisciplinar no cuidado as pacientes com tumores ginecologicos.",
    date: "14/11/2026",
    time: "08:00 as 12:00",
    location: "Verdegreen Hotel",
    address: "Av. Joao Mauricio, 255 - Manaira",
    city: "Joao Pessoa",
    state: "PB",
    targetAudience:
      "Ginecologistas oncologistas, oncologistas clinicos, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar profissionais sobre diagnostico e tratamento de tumores ginecologicos, discutir casos complexos e promover abordagem multidisciplinar.",
    image: "/banners/banner_tumores_ginecologicos.webp",
    speakers: [],
  },
];
