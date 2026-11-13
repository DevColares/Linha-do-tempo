import type { TimelineEvent } from '../types';

export const INITIAL_EXPENSES: TimelineEvent[] = [
  {
    id: 'mom-001',
    eventType: 'moment',
    title: 'Primeiro Dia de Aula no Colégio',
    date: '2023-02-06',
    description: 'Um dia inesquecível! Todo animado com a mochila nova, com um sorriso de orelha a orelha e cheio de curiosidade.',
    momentTag: 'conquista',
    emotion: 'orgulho',
    location: 'Colégio Nova Esperança',
    attachments: [
      {
        id: 'rec-m1',
        name: 'Foto_Entrada_Escola.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
        size: '2.8 MB'
      }
    ]
  },
  {
    id: 'exp-001',
    eventType: 'financial',
    title: 'Pensão Alimentícia - Janeiro/2024',
    amount: 1412.00,
    date: '2024-01-05',
    category: 'pensao',
    description: 'Depósito integral referente à pensão alimentícia mensal.',
    paymentMethod: 'PIX',
    attachments: [
      {
        id: 'rec-1',
        name: 'Comprovante_PIX_Jan2024.pdf',
        type: 'pdf',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        size: '180 KB'
      }
    ],
    isEssential: true
  },
  {
    id: 'exp-002',
    eventType: 'financial',
    title: 'Kit Material Escolar & Mochila',
    amount: 580.50,
    date: '2024-01-20',
    category: 'educacao',
    description: 'Cadernos, estojo, mochila temática, lápis de cor e livros didáticos.',
    paymentMethod: 'Cartão',
    attachments: [
      {
        id: 'rec-2',
        name: 'NotaFiscal_Papelaria.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
        size: '1.2 MB'
      }
    ],
    isEssential: true,
    location: 'Livraria & Papelaria Central'
  },
  {
    id: 'mom-002',
    eventType: 'moment',
    title: 'Aprendendo a Andar de Bicicleta Sem Rodinhas',
    date: '2024-02-14',
    description: 'Depois de algumas tentativas no parque, conseguiu equilibrar e pedalou sozinho. O abraço e a comemoração foram inesquecíveis.',
    momentTag: 'conquista',
    emotion: 'alegria',
    location: 'Parque da Cidade',
    attachments: [
      {
        id: 'rec-m2',
        name: 'Primeira_Pedalada.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80',
        size: '3.5 MB'
      }
    ]
  },
  {
    id: 'exp-003',
    eventType: 'financial',
    title: 'Guarda-Roupa de Inverno & Tênis',
    amount: 450.00,
    date: '2024-03-12',
    category: 'vestuario',
    description: 'Casaco térmico, 2 pares de tênis esportivos, 4 calças e meias.',
    paymentMethod: 'PIX',
    attachments: [
      {
        id: 'rec-3',
        name: 'Foto_Roupas_Compradas.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80',
        size: '2.4 MB'
      }
    ],
    isEssential: true
  },
  {
    id: 'exp-004',
    eventType: 'financial',
    title: 'Consulta Oftalmológica & Óculos de Grau',
    amount: 620.00,
    date: '2024-05-18',
    category: 'saude',
    description: 'Exame de acuidade visual com especialista e armação flexível infantil.',
    paymentMethod: 'Cartão',
    attachments: [
      {
        id: 'rec-4',
        name: 'Receita_e_Recibo_Otica.pdf',
        type: 'pdf',
        url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80',
        size: '420 KB'
      }
    ],
    isEssential: true
  },
  {
    id: 'mom-003',
    eventType: 'moment',
    title: 'Passeio no Aquário Municipal & Almoço',
    date: '2024-07-22',
    description: 'Ficou encantado vendo as tartarugas e tubarões. Comemos sorvete e tiramos várias fotos divertidas.',
    momentTag: 'viagem',
    emotion: 'amor',
    location: 'Aquário Oceânico',
    attachments: [
      {
        id: 'rec-m3',
        name: 'Foto_Aquario.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        size: '2.1 MB'
      }
    ]
  },
  {
    id: 'exp-005',
    eventType: 'financial',
    title: 'Festa de Aniversário & Presente',
    amount: 750.00,
    date: '2024-08-10',
    category: 'lazer',
    description: 'Bolo temático, docinhos, salgados e brinquedo tão sonhado.',
    paymentMethod: 'PIX',
    attachments: [
      {
        id: 'rec-5',
        name: 'Momento_Parque_Aniversario.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
        size: '3.1 MB'
      }
    ],
    isEssential: false
  }
];
