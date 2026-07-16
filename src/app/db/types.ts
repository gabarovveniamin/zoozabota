// Shared types for the ZooZabota application (used by both API and client)

export interface Pet {
  id?: number;
  name: string;
  breed: string;
  years: string;
  description?: string;
  emoji: string;
  photo?: string; // base64 encoded image
  createdAt?: string; // ISO date string
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
  createdAt?: string;
}

export interface Service {
  id?: number;
  tag: string;
  title: string | { ru: string; kz: string; en: string };
  description: string | { ru: string; kz: string; en: string };
  image?: string; // base64 encoded image
  price?: string | { ru: string; kz: string; en: string };
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
  createdAt?: string;
}

export interface DocumentItem {
  id?: number;
  title: string;
  description: string;
  fileName: string;
  fileData: string; // base64 encoded PDF file
  fileType: string; // e.g. 'application/pdf'
  uploadedAt: string; // ISO date string
}

export const MOCK_PDF = 'JVBERi0xLjQKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDU5NSA4NDIgXQogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDQgMCBSID4+ID4+CiAgICAgL0NvbnRlbnRzIDUgMCBSCiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvVHlwZSAvRm9udAogICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgIC9CYXNlRm9udCAvSGVsdmV0aWNhCiAgPj4KZW5kb2JqCjUgMCBvYmoKICA8PCAvTGVuZ3RoIDQ0ID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooWm9vWmFib3RhIE9mZmljaWFsIERvY3VtZW50KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxNDMgMDAwMDAgbiAKMDAwMDAwMDI3MSAwMDAwMCBuIAowMDAwMDAwMzU1IDAwMDAwIG4gCnRyYWlsZXIKICA8PCAvU2l6ZSA2CiAgICAgL1Jvb3QgMSAwIFIKICA+PgpzdGFydHhyZWYKNDQ4CiUlRU9G';

export const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  { tag: 'Гранит', title: 'Гранитный стандарт', description: 'Классический гранитный памятник с гравировкой имени, дат и фотографии питомца.', price: { ru: 'от 45 000 ₸', kz: '45 000 ₸-ден бастап', en: 'from 45 000 ₸' }, category: 'Гранитные', order: 1 },
  { tag: 'Мрамор', title: 'Мраморный классик', description: 'Элегантный белый мрамор с индивидуальной надписью и орнаментом.', price: { ru: 'от 65 000 ₸', kz: '65 000 ₸-ден бастап', en: 'from 65 000 ₸' }, category: 'Мраморные', order: 2 },
  { tag: 'Дерево', title: 'Деревянный крест', description: 'Тёплый деревянный памятный знак ручной работы из натуральных пород.', price: { ru: 'от 18 000 ₸', kz: '18 000 ₸-ден бастап', en: 'from 18 000 ₸' }, category: 'Деревянные', order: 3 },
  { tag: 'Премиум', title: 'Гранит Премиум', description: 'Премиальный гранит с полировкой, цветным портретом и именной гравировкой.', price: { ru: 'от 120 000 ₸', kz: '120 000 ₸-ден бастап', en: 'from 120 000 ₸' }, category: 'Гранитные', order: 4 },
  { tag: 'Бюджет', title: 'Именная табличка', description: 'Компактная металлическая табличка с именем и датами — доступный вариант.', price: { ru: 'от 8 000 ₸', kz: '8 000 ₸-ден бастап', en: 'from 8 000 ₸' }, category: 'Гранитные', order: 5 },
  { tag: 'VIP', title: 'Индивидуальный заказ', description: 'Уникальный памятник по вашему эскизу из любого материала на выбор.', price: { ru: 'по запросу', kz: 'сұраныс бойынша', en: 'upon request' }, category: 'Индивидуальные', order: 6 },
];

export const DEFAULT_DOCUMENTS: Omit<DocumentItem, 'id'>[] = [];

export interface ShopItem {
  id?: number;
  title: { ru: string; kz: string; en: string };
  description: { ru: string; kz: string; en: string };
  price: { ru: string; kz: string; en: string };
  image?: string; // base64 encoded image
  status: 'in_stock' | 'out_of_stock';
  category?: string;
  createdAt?: string;
}

export interface ShopOrderItem {
  itemId: number;
  title: string;
  price: string;
  quantity: number;
  image?: string;
}

export interface ShopOrder {
  id?: number;
  items: ShopOrderItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  totalPrice: string;
  status: 'pending' | 'completed' | 'cancelled' | 'paid';
  createdAt?: string;
}
