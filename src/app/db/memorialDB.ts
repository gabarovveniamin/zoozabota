import Dexie, { type Table } from 'dexie';

export interface Pet {
  id?: number;
  name: string;
  breed: string;
  years: string;
  description?: string;
  emoji: string;
  photo?: string; // base64 encoded image
  createdAt?: Date;
}

export interface PetRequest {
  id?: number;
  name: string;
  breed: string;
  years: string;
  description?: string;
  emoji: string;
  photo?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
}

export interface Service {
  id?: number;
  tag: string;
  title: string | { ru: string; kz: string; en: string };
  description: string | { ru: string; kz: string; en: string };
  image?: string; // base64 encoded image
  price?: string;
  category?: string;
  order: number;
}

export interface ServiceRequest {
  id?: number;
  serviceId: number;
  serviceTitle: string;
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  status: 'pending' | 'done' | 'rejected';
  createdAt?: Date;
}

export interface DocumentItem {
  id?: number;
  title: string;
  description: string;
  fileName: string;
  fileData: string; // base64 encoded PDF file
  fileType: string; // e.g. 'application/pdf'
  uploadedAt: Date;
}

export class MemorialDatabase extends Dexie {
  pets!: Table<Pet>;
  petRequests!: Table<PetRequest>;
  services!: Table<Service>;
  serviceRequests!: Table<ServiceRequest>;
  documents!: Table<DocumentItem>;

  constructor() {
    super('ZooZabotaMemorial');
    this.version(1).stores({
      pets: '++id, createdAt',
      petRequests: '++id, status, createdAt',
      services: '++id, order',
    });
    this.version(2).stores({
      pets: '++id, createdAt',
      petRequests: '++id, status, createdAt',
      services: '++id, order, category',
    });
    this.version(3).stores({
      pets: '++id, createdAt',
      petRequests: '++id, status, createdAt',
      services: '++id, order, category',
      serviceRequests: '++id, status, serviceId, createdAt',
    });
    this.version(4).stores({
      pets: '++id, createdAt',
      petRequests: '++id, status, createdAt',
      services: '++id, order, category',
      serviceRequests: '++id, status, serviceId, createdAt',
      documents: '++id, title, uploadedAt',
    });
  }
}

export const db = new MemorialDatabase();

export const MOCK_PDF = 'JVBERi0xLjQKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDU5NSA4NDIgXQogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDQgMCBSID4+ID4+CiAgICAgL0NvbnRlbnRzIDUgMCBSCiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvVHlwZSAvRm9udAogICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgIC9CYXNlRm9udCAvSGVsdmV0aWNhCiAgPj4KZW5kb2JqCjUgMCBvYmoKICA8PCAvTGVuZ3RoIDQ0ID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooWm9vWmFib3RhIE9mZmljaWFsIERvY3VtZW50KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxNDMgMDAwMDAgbiAKMDAwMDAwMDI3MSAwMDAwMCBuIAowMDAwMDAwMzU1IDAwMDAwIG4gCnRyYWlsZXIKICA8PCAvU2l6ZSA2CiAgICAgL1Jvb3QgMSAwIFIKICA+PgpzdGFydHhyZWYKNDQ4CiUlRU9G';

export const DEFAULT_DOCUMENTS: Omit<DocumentItem, 'id'>[] = [
  {
    title: 'Публичный договор-оферта',
    description: 'Регулирует порядок оказания услуг мемориального комплекса.',
    fileName: 'public_offer_zoozabota.pdf',
    fileData: MOCK_PDF,
    fileType: 'application/pdf',
    uploadedAt: new Date('2026-06-13T12:00:00Z'),
  },
  {
    title: 'Правила посещения комплекса',
    description: 'Правила поведения на территории колумбария и мемориала.',
    fileName: 'rules_and_regulations.pdf',
    fileData: MOCK_PDF,
    fileType: 'application/pdf',
    uploadedAt: new Date('2026-06-13T12:00:00Z'),
  },
  {
    title: 'Политика конфиденциальности',
    description: 'Правила сбора, обработки и защиты персональных данных.',
    fileName: 'privacy_policy_zoozabota.pdf',
    fileData: MOCK_PDF,
    fileType: 'application/pdf',
    uploadedAt: new Date('2026-06-13T12:00:00Z'),
  },
  {
    title: 'Устав фонда «Өмірге Үміт Бер»',
    description: 'Учредительный документ общественного фонда.',
    fileName: 'charter_omirge_umit_ber.pdf',
    fileData: MOCK_PDF,
    fileType: 'application/pdf',
    uploadedAt: new Date('2026-06-13T12:00:00Z'),
  },
];

// Default services to seed on first load
export const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  { tag: 'Гранит', title: 'Гранитный стандарт', description: 'Классический гранитный памятник с гравировкой имени, дат и фотографии питомца.', price: 'от 45 000 ₸', category: 'Гранитные', order: 1 },
  { tag: 'Мрамор', title: 'Мраморный классик', description: 'Элегантный белый мрамор с индивидуальной надписью и орнаментом.', price: 'от 65 000 ₸', category: 'Мраморные', order: 2 },
  { tag: 'Дерево', title: 'Деревянный крест', description: 'Тёплый деревянный памятный знак ручной работы из натуральных пород.', price: 'от 18 000 ₸', category: 'Деревянные', order: 3 },
  { tag: 'Премиум', title: 'Гранит Премиум', description: 'Премиальный гранит с полировкой, цветным портретом и именной гравировкой.', price: 'от 120 000 ₸', category: 'Гранитные', order: 4 },
  { tag: 'Бюджет', title: 'Именная табличка', description: 'Компактная металлическая табличка с именем и датами — доступный вариант.', price: 'от 8 000 ₸', category: 'Гранитные', order: 5 },
  { tag: 'VIP', title: 'Индивидуальный заказ', description: 'Уникальный памятник по вашему эскизу из любого материала на выбор.', price: 'по запросу', category: 'Индивидуальные', order: 6 },
];
