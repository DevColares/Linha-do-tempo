export type TimelineEventType = 'financial' | 'moment';

export type ExpenseCategory = 
  | 'pensao'       // Pensão alimentícia
  | 'vestuario'    // Roupas, calçados e acessórios
  | 'saude'        // Consultas, medicamentos, plano de saúde, dentista
  | 'educacao'     // Mensalidade, material escolar, uniforme, cursos
  | 'lazer'        // Passeios, viagens, festas, brinquedos
  | 'alimentacao'  // Supermercado extra, alimentação especial
  | 'outros';      // Custos diversos e imprevistos

export type MomentTag = 
  | 'conquista'    // Primeira palavra, primeiro dia de aula, nota boa
  | 'viagem'       // Férias, praia, passeio especial
  | 'aniversario'  // Festas de aniversário
  | 'saude_cura'   // Recuperação, alta médica, crescimento
  | 'afeto'        // Abraço, momento entre pai e filho, brincadeiras
  | 'esporte';     // Judô, futebol, natação, medalha

export interface ReceiptAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  dateUploaded?: string;
  size?: string;
}

export interface TimelineEvent {
  id: string;
  eventType: TimelineEventType; // 'financial' (gasto com comprovante) ou 'moment' (memória afetiva/marco)
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  attachments: ReceiptAttachment[];
  location?: string;
  
  // Específico para 'financial'
  amount?: number;
  category?: ExpenseCategory;
  paymentMethod?: 'PIX' | 'Cartão' | 'Boleto' | 'Transferência' | 'Dinheiro';
  isEssential?: boolean;

  // Específico para 'moment'
  momentTag?: MomentTag;
  emotion?: 'orgulho' | 'alegria' | 'amor' | 'superacao' | 'gratidao';
}

// Retrocompatibilidade
export type TimelineExpense = TimelineEvent;

export const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; color: string; bgGlow: string; icon: string }> = {
  pensao: {
    label: 'Pensão Alimentícia',
    color: '#60a5fa', // Azul celeste
    bgGlow: 'rgba(96, 165, 250, 0.35)',
    icon: 'ShieldCheck'
  },
  vestuario: {
    label: 'Roupas & Calçados',
    color: '#f472b6', // Rosa brilhante
    bgGlow: 'rgba(244, 114, 182, 0.35)',
    icon: 'Shirt'
  },
  saude: {
    label: 'Saúde & Cuidados',
    color: '#34d399', // Esmeralda
    bgGlow: 'rgba(52, 211, 153, 0.35)',
    icon: 'HeartPulse'
  },
  educacao: {
    label: 'Educação & Aprendizado',
    color: '#fbbf24', // Âmbar dourado
    bgGlow: 'rgba(251, 191, 36, 0.35)',
    icon: 'GraduationCap'
  },
  lazer: {
    label: 'Lazer & Experiências',
    color: '#a78bfa', // Roxo cósmico
    bgGlow: 'rgba(167, 139, 250, 0.35)',
    icon: 'Sparkles'
  },
  alimentacao: {
    label: 'Nutrição & Extras',
    color: '#fb923c', // Laranja
    bgGlow: 'rgba(251, 146, 60, 0.35)',
    icon: 'Apple'
  },
  outros: {
    label: 'Outros & Suporte Geral',
    color: '#94a3b8', // Cinza luminoso
    bgGlow: 'rgba(148, 163, 184, 0.35)',
    icon: 'Layers'
  }
};

export const MOMENT_TAG_CONFIG: Record<MomentTag, { label: string; color: string; bgGlow: string; icon: string }> = {
  afeto: {
    label: 'Amor & Afeto',
    color: '#fb7185', // Rosa suave
    bgGlow: 'rgba(251, 113, 133, 0.35)',
    icon: 'Heart'
  },
  conquista: {
    label: 'Conquista & Passo',
    color: '#facc15', // Amarelo sol
    bgGlow: 'rgba(250, 204, 21, 0.35)',
    icon: 'Trophy'
  },
  viagem: {
    label: 'Viagem & Passeio',
    color: '#38bdf8', // Azul oceano
    bgGlow: 'rgba(56, 189, 248, 0.35)',
    icon: 'Compass'
  },
  aniversario: {
    label: 'Aniversário',
    color: '#c084fc', // Lilás festa
    bgGlow: 'rgba(192, 132, 252, 0.35)',
    icon: 'Cake'
  },
  saude_cura: {
    label: 'Crescimento & Saúde',
    color: '#4ade80', // Verde vida
    bgGlow: 'rgba(74, 222, 128, 0.35)',
    icon: 'Activity'
  },
  esporte: {
    label: 'Esporte & Atividade',
    color: '#fb923c', // Laranja energia
    bgGlow: 'rgba(251, 146, 60, 0.35)',
    icon: 'Flame'
  }
};
