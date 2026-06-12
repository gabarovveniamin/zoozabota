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

export class MemorialDatabase extends Dexie {
  pets!: Table<Pet>;
  petRequests!: Table<PetRequest>;
  services!: Table<Service>;
  serviceRequests!: Table<ServiceRequest>;

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
  }
}

export const db = new MemorialDatabase();

// Default services to seed on first load
export const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  { tag: 'Гранит', title: 'Гранитный стандарт', description: 'Классический гранитный памятник с гравировкой имени, дат и фотографии питомца.', price: 'от 45 000 ₸', category: 'Гранитные', order: 1 },
  { tag: 'Мрамор', title: 'Мраморный классик', description: 'Элегантный белый мрамор с индивидуальной надписью и орнаментом.', price: 'от 65 000 ₸', category: 'Мраморные', order: 2 },
  { tag: 'Дерево', title: 'Деревянный крест', description: 'Тёплый деревянный памятный знак ручной работы из натуральных пород.', price: 'от 18 000 ₸', category: 'Деревянные', order: 3 },
  { tag: 'Премиум', title: 'Гранит Премиум', description: 'Премиальный гранит с полировкой, цветным портретом и именной гравировкой.', price: 'от 120 000 ₸', category: 'Гранитные', order: 4 },
  { tag: 'Бюджет', title: 'Именная табличка', description: 'Компактная металлическая табличка с именем и датами — доступный вариант.', price: 'от 8 000 ₸', category: 'Гранитные', order: 5 },
  { tag: 'VIP', title: 'Индивидуальный заказ', description: 'Уникальный памятник по вашему эскизу из любого материала на выбор.', price: 'по запросу', category: 'Индивидуальные', order: 6 },
];
