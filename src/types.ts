/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  experience: string;
  badge: string;
  icon: string;
}

export interface TableCategory {
  id: string;
  area: string;
  name: string;
  capacity: number;
  price: number;
  benefits: string[];
}

export const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: "praia_experience",
    name: "🌊 Praia Experience",
    price: 20000,
    badge: "Acesso Praia",
    experience: "Ideal para quem deseja desfrutar do ambiente elegante do evento, socializar, tirar fotografias e apreciar a vista única da Baía de Luanda.",
    benefits: [
      "Acesso à deslumbrante área da praia",
      "Zona cenográfica exclusiva para fotografias de alta costura",
      "Vista panorâmica indescritível para o mar e skyline de Luanda",
      "Welcome Drink de cortesia na chegada"
    ],
    icon: "Palmtree"
  },
  {
    id: "realeza_premium",
    name: "✨ LA REALEZA Premium",
    price: 35000,
    badge: "Acesso Completo + 1º Piso",
    experience: "Perfeita para quem procura uma experiência mais completa, com acesso à principal área de entretenimento e ao ambiente mais dinâmico do evento.",
    benefits: [
      "Acesso completo à área da praia",
      "Acesso exclusivo ao 1.º Piso",
      "Entrada para a área principal do evento",
      "Acesso vitalício à pista de dança comandada por DJs de elite",
      "Zona interativa de entretenimento acústico e visual",
      "Vista panorâmica superior da Baía e da Cidade"
    ],
    icon: "Sparkles"
  },
  {
    id: "realeza_vip",
    name: "👑 LA REALEZA VIP",
    price: 80000,
    badge: "Acesso Supremo Total",
    experience: "Criada para convidados de prestígio que valorizam a máxima exclusividade, o conforto imperial e o acesso privilegiado às melhores áreas da marca.",
    benefits: [
      "Acesso irrestrito a todo o evento: Praia, 1.º Piso e 2.º Piso VIP",
      "Fast-Track: Entrada prioritária com recepção por staff dedicado",
      "Acesso ao Lounge VIP do 2.º Piso com atendimento ultraluxuoso",
      "Cocktail bar premium e serviços de alta gastronomia dedicados",
      "Poltronas e áreas reservadas com a melhor experiência de todo o evento"
    ],
    icon: "Crown"
  }
];

export const TABLE_CATEGORIES: TableCategory[] = [
  // 🌊 Área Praia
  {
    id: "mesa_praia",
    area: "🌊 Área Praia",
    name: "Mesa Praia",
    capacity: 4,
    price: 80000,
    benefits: [
      "Mesa reservada na beira-mar",
      "Melhor conforto para o grupo",
      "Atendimento dedicado por garçons reais",
      "Vista privilegiada para o mar"
    ]
  },
  {
    id: "mesa_praia_premium",
    area: "🌊 Área Praia",
    name: "Mesa Praia Premium",
    capacity: 6,
    price: 120000,
    benefits: [
      "Mesa ampliada e reservada sob as estrelas",
      "Máximo conforto para seu círculo exclusivo",
      "Atendimento imperial dedicado",
      "Vista panorâmica estelar e brisa marinha direta"
    ]
  },
  // ✨ 1.º Piso – LA Realeza Premium
  {
    id: "mesa_silver",
    area: "✨ 1.º Piso – LA Realeza Premium",
    name: "Mesa Silver",
    capacity: 4,
    price: 150000,
    benefits: [
      "Mesa reservada no 1.º Piso",
      "Localização muito privilegiada",
      "Vista panorâmica de alta definição para a cidade e mar",
      "Acesso rápido e integrado à pista principal"
    ]
  },
  {
    id: "mesa_gold",
    area: "✨ 1.º Piso – LA Realeza Premium",
    name: "Mesa Gold",
    capacity: 6,
    price: 220000,
    benefits: [
      "Mesa suntuosa em posição cimeira no 1.º Piso",
      "Decoração premium e assentos acolchoados",
      "Vista panorâmica infinita para a cidade e o Atlântico",
      "Visibilidade e acesso perfeitos para o show principal"
    ]
  },
  // 👑 2.º Piso – Royal VIP
  {
    id: "mesa_royal",
    area: "👑 2.º Piso – Royal VIP",
    name: "Mesa Royal",
    capacity: 6,
    price: 300000,
    benefits: [
      "Localização na área mais exclusiva do evento (2.º Piso)",
      "Vista premium absoluta para toda a deslumbrante Baía de Luanda",
      "Atendimento personalizado VIP de alto padrão com mordomos dedicados",
      "Entrada prioritária sem filas",
      "Ambiente altamente privado, reservado e sofisticado"
    ]
  },
  {
    id: "mesa_imperial",
    area: "👑 2.º Piso – Royal VIP",
    name: "Mesa Imperial",
    capacity: 8,
    price: 400000,
    benefits: [
      "A mesa de maior prestígio de todo o evento",
      "Capacidade majestosa para os seus 8 convidados de honra",
      "Posicionamento central supremo no 2.º Piso VIP",
      "Vista irrestrita de 360º para Luanda e o oceano",
      "Atendimento personalizado ultraluxuoso e mimos gourmet exclusivos",
      "Entrada com passadeira vermelha e prioridade imperial absoluta",
      "Experiência REALEZA completa ao mais alto nível imaginável"
    ]
  }
];

