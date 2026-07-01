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
      "Atualização em tumores do trato digestivo com foco em diagnóstico precoce, terapias personalizadas e manejo multidisciplinar.",
    fullDescription:
      "O Grand Rounds de Tumores Gastrointestinais reúne especialistas de referência para a discussão aprofundada de casos clínicos desafiadores e atualização nas mais recentes evidências relacionadas às neoplasias do sistema digestivo.\n\nSerão apresentados casos reais com análise multidisciplinar, contemplando estratégias cirúrgicas oncológicas, técnicas modernas de radioterapia, quimioterapia sistêmica, terapias-alvo e imunoterapia, sempre com foco na individualização do tratamento.\n\nCom abordagem prática e fundamentada em evidências científicas, o encontro promove a integração entre as diferentes especialidades envolvidas no cuidado do paciente oncológico, fortalecendo a tomada de decisão compartilhada e a excelência no manejo dos tumores gastrointestinais.",
    date: "14/03/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience:
      "Oncologistas clínicos, cirurgiões do aparelho digestivo, cirurgiões oncológicos, gastroenterologistas, hepatologistas, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar conhecimentos sobre diagnóstico precoce, biomarcadores moleculares e tratamento multidisciplinar de tumores gastrointestinais, discutir casos clínicos complexos e promover integração entre as especialidades envolvidas no cuidado oncológico digestivo.",
    image: "/banners/Tumores Gastrointestinais.webp",
    speakers: [],
    schedule: [
      { time: "08:00 - 08:30", title: "Credenciamento e Coffee Break", speaker: null },
      { time: "08:30 - 09:00", title: "Abertura e Boas-vindas", speaker: null },
      { time: "09:00 - 10:00", title: "Tema 1", speaker: null },
      { time: "10:00 - 10:15", title: "Intervalo", speaker: null },
      { time: "10:15 - 11:15", title: "Tema 2", speaker: null },
      { time: "11:15 - 12:00", title: "Discussão de Casos Clínicos", speaker: null },
    ],
  },
  {
    id: "tumores-geniturinarios",
    slug: "tumores-geniturinarios",
    title: "Grand Rounds - Tumores Geniturinários",
    shortDescription:
      "Discussão de casos complexos em oncologia geniturinária com foco em medicina de precisão, terapias-alvo e imunoterapia.",
    fullDescription:
      "O Grand Rounds de Tumores Geniturinários reúne especialistas para discutir as mais recentes atualizações no diagnóstico, estadiamento e tratamento das neoplasias do trato geniturinário, com foco em decisões clínicas baseadas em evidências.\n\nO encontro abordará de forma abrangente o câncer de próstata em todos os seus estágios, além de tumores renais, câncer de bexiga e neoplasias do trato urinário superior.\n\nPor meio da discussão de casos clínicos reais e da integração entre urologia, oncologia clínica, radioterapia, patologia e demais especialidades envolvidas, o evento proporciona uma atualização prática, multidisciplinar e alinhada às evidências científicas mais recentes.",
    date: "21/04/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience:
      "Oncologistas clínicos, urologistas, uro-oncologistas, cirurgiões oncológicos, radioterapeutas, patologistas, geneticistas, enfermeiros oncológicos, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar conhecimentos sobre diagnóstico molecular, medicina de precisão e tratamento personalizado de tumores geniturinários, discutir casos clínicos complexos e promover integração multidisciplinar entre oncologia clínica e urologia oncológica.",
    image: "/banners/Tumores Geniturinarios.webp",
    speakers: [],
  },
  {
    id: "hematologia",
    slug: "hematologia",
    title: "Grand Rounds - Hematologia",
    shortDescription:
      "Discussão de casos complexos em hematologia oncológica e atualizações em leucemias e linfomas.",
    fullDescription:
      "O Grand Rounds de Hematologia reúne hematologistas, oncologistas, patologistas e demais especialidades envolvidas no cuidado de pacientes onco-hematológicos para a discussão de casos complexos e atualização científica nas doenças hematológicas malignas.\n\nSerão abordados temas como leucemias agudas e crônicas, linfomas, mieloma múltiplo e síndromes mielodisplásicas, com apresentação de casos clínicos desafiadores.\n\nCom enfoque prático e fundamentado nas evidências científicas mais recentes, o evento visa fortalecer a discussão multidisciplinar e aprimorar o cuidado ao paciente onco-hematológico.",
    date: "09/05/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience:
      "Hematologistas, oncologistas, patologistas, residentes e estudantes de medicina, equipe multiprofissional",
    objective:
      "Atualizar conhecimentos em hematologia oncológica, discutir casos complexos e promover integração entre especialidades relacionadas.",
    image: "/banners/banner_hematologia.webp",
    speakers: [],
  },
  {
    id: "multiprofissional",
    slug: "multiprofissional",
    title: "Grand Rounds - Multiprofissional",
    shortDescription:
      "Encontro multidisciplinar abordando cuidados integrados ao paciente oncológico.",
    fullDescription:
      "O Grand Rounds Multiprofissional é um encontro dedicado ao cuidado integral do paciente oncológico, reunindo diferentes áreas da assistência para uma discussão ampla, prática e centrada na pessoa.\n\nSerão abordados temas como comunicação em oncologia, cuidados paliativos, reabilitação oncológica, nutrição, psicologia oncológica e farmacologia clínica.\n\nO evento promove a integração entre médicos, enfermeiros, farmacêuticos, nutricionistas, psicólogos, fisioterapeutas e demais profissionais envolvidos na jornada do paciente com câncer.",
    date: "18/07/2026",
    time: "08:00 às 12:30",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience:
      "Médicos, enfermeiros, farmacêuticos, nutricionistas, psicólogos, fisioterapeutas, assistentes sociais, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Promover integração multidisciplinar, discutir cuidados integrados ao paciente oncológico e fortalecer o trabalho em equipe na prática clínica.",
    image: "/banners/banner_multiprofissional.webp",
    speakers: [],
    schedule: [
      { time: "08:00 - 08:15", title: "Abertura e boas-vindas", speaker: null },
      {
        time: "08:15 - 08:55",
        title: "Simpósio Satélite de Abertura - Manejo de eventos imunomediados",
        speaker: "Enf. Tamara, BP",
      },
      {
        time: "08:55 - 10:25",
        title: "Round Table - Mesa 1 (Enfermagem)",
        speaker: "Navegação e desfechos do paciente",
      },
      {
        time: "08:55 - 10:25",
        title: "Round Table - Mesa 2 (Enfermagem)",
        speaker: "Eventos imunomediados e toxicidades quimiorrelacionadas",
      },
      {
        time: "08:55 - 10:25",
        title: "Round Table - Mesa 3 (Farmácia)",
        speaker: "O farmacêutico nas múltiplas etapas do cuidado",
      },
      {
        time: "08:55 - 10:25",
        title: "Round Table - Mesa 4 (Nutrição)",
        speaker: "Reabilitação nutricional e performance",
      },
      { time: "10:25 - 10:45", title: "Intervalo", speaker: null },
      {
        time: "10:45 - 11:05",
        title: "Plenária - Mesa 1",
        speaker: "Navegação e desfechos",
      },
      {
        time: "11:05 - 11:25",
        title: "Plenária - Mesa 2",
        speaker: "Toxicidades imunomediadas/quimiorrelacionadas",
      },
      {
        time: "11:25 - 11:45",
        title: "Plenária - Mesa 3",
        speaker: "Farmácia clínica na jornada do paciente",
      },
      {
        time: "11:45 - 12:05",
        title: "Plenária - Mesa 4",
        speaker: "Reabilitação nutricional e performance",
      },
      {
        time: "12:05 - 12:30",
        title: "Simpósio Satélite de Encerramento - Navegação em enfermagem",
        speaker: null,
      },
    ],
  },
  {
    id: "torax",
    slug: "torax",
    title: "Grand Rounds - Tórax",
    shortDescription:
      "Atualização em câncer de pulmão e tumores do tórax com foco em medicina de precisão.",
    fullDescription:
      "O Grand Rounds de Tórax é dedicado à atualização e discussão dos principais avanços no manejo do câncer de pulmão e de outros tumores torácicos, com especial ênfase em medicina de precisão e terapias personalizadas.\n\nSerão apresentados casos clínicos desafiadores, permitindo a análise multidisciplinar de estratégias diagnósticas, testes moleculares, definição de biomarcadores, indicação de terapias-alvo e imunoterapia.\n\nCom abordagem prática e fundamentada nas evidências científicas mais recentes, o encontro visa promover a integração entre oncologia clínica, pneumologia, cirurgia torácica, radioterapia e patologia.",
    date: "15/08/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience:
      "Oncologistas clínicos, cirurgiões torácicos, pneumologistas, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar conhecimentos sobre diagnóstico molecular, terapias personalizadas e tratamento de tumores torácicos baseado em evidências científicas.",
    image: "/banners/banner_torax.webp",
    speakers: [],
  },
  {
    id: "mama",
    slug: "mama",
    title: "Grand Rounds - Mama",
    shortDescription:
      "Discussão de casos de câncer de mama com foco em tratamento personalizado e medicina de precisão.",
    fullDescription:
      "O Grand Rounds de Mama reúne especialistas para a discussão aprofundada de casos complexos de câncer de mama e das mais recentes atualizações terapêuticas, com foco na prática clínica baseada em evidências.\n\nO encontro abordará os diferentes subtipos moleculares, biomarcadores preditivos e prognósticos, terapias-alvo, imunoterapia e estratégias de tratamento neoadjuvante e adjuvante.\n\nCom abordagem multidisciplinar e prática, o evento visa fortalecer a integração entre as especialidades envolvidas e promover atualização científica de excelência no cuidado às pacientes com câncer de mama.",
    date: "12/09/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience:
      "Oncologistas clínicos, mastologistas, cirurgiões plásticos, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar profissionais sobre tratamento personalizado do câncer de mama, discutir casos complexos e promover abordagem multidisciplinar.",
    image: "/banners/banner_mama.webp",
    speakers: [],
  },
  {
    id: "medicina-intensiva",
    slug: "medicina-intensiva",
    title: "Grand Rounds - Medicina Intensiva",
    shortDescription:
      "Suporte intensivo ao paciente oncológico: complicações agudas e cuidados críticos.",
    fullDescription:
      "O Grand Rounds de Medicina Intensiva em Oncologia é dedicado ao manejo de complicações agudas e aos cuidados críticos em pacientes oncológicos, com foco na tomada de decisão baseada em evidências e na integração entre especialidades.\n\nO encontro abordará as principais urgências oncológicas, sepse em pacientes imunossuprimidos, insuficiência respiratória e manejo da dor em contexto crítico.\n\nCom abordagem prática e multidisciplinar, o evento visa atualizar intensivistas e oncologistas, promovendo alinhamento assistencial e aprimorando o cuidado ao paciente oncológico em situação crítica.",
    date: "24/10/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience:
      "Intensivistas, oncologistas, emergencistas, anestesiologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar conhecimentos sobre manejo de complicações agudas em pacientes oncológicos e promover integração entre medicina intensiva e oncologia.",
    image: "/banners/banner_medicina_intensiva.webp",
    speakers: [],
  },
  {
    id: "tumores-ginecologicos",
    slug: "tumores-ginecologicos",
    title: "Grand Rounds - Tumores Ginecológicos",
    shortDescription:
      "Atualização em câncer ginecológico: ovário, colo do útero, endométrio e vulva.",
    fullDescription:
      "O Grand Rounds de Tumores Ginecológicos é dedicado às principais atualizações no diagnóstico, estadiamento e tratamento dos cânceres ginecológicos, com foco em decisões clínicas baseadas em evidências e na abordagem multidisciplinar.\n\nO encontro abordará câncer de ovário, colo do útero, endométrio, vulva e vagina, com apresentação de casos clínicos complexos que permitirão debate integrado.\n\nCom abordagem prática e científica, o evento visa promover atualização de excelência e fortalecer a discussão multidisciplinar no cuidado às pacientes com tumores ginecológicos.",
    date: "14/11/2026",
    time: "08:00 às 12:00",
    location: "Verdegreen Hotel",
    address: "Av. João Maurício, 255 - Manaíra",
    city: "João Pessoa",
    state: "PB",
    targetAudience:
      "Ginecologistas oncologistas, oncologistas clínicos, radioterapeutas, patologistas, residentes, equipe multiprofissional e estudantes de medicina",
    objective:
      "Atualizar profissionais sobre diagnóstico e tratamento de tumores ginecológicos, discutir casos complexos e promover abordagem multidisciplinar.",
    image: "/banners/banner_tumores_ginecologicos.webp",
    speakers: [],
  },
];
