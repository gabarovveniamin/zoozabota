import { neon } from '@neondatabase/serverless';

const MOCK_PDF = 'JVBERi0xLjQKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDU5NSA4NDIgXQogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDQgMCBSID4+ID4+CiAgICAgL0NvbnRlbnRzIDUgMCBSCiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvVHlwZSAvRm9udAogICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgIC9CYXNlRm9udCAvSGVsdmV0aWNhCiAgPj4KZW5kb2JqCjUgMCBvYmoKICA8PCAvTGVuZ3RoIDQ0ID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooWm9vWmFib3RhIE9mZmljaWFsIERvY3VtZW50KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxNDMgMDAwMDAgbiAKMDAwMDAwMDI3MSAwMDAwMCBuIAowMDAwMDAwMzU1IDAwMDAwIG4gCnRyYWlsZXIKICA8PCAvU2l6ZSA2CiAgICAgL1Jvb3QgMSAwIFIKICA+PgpzdGFydHhyZWYKNDQ4CiUlRU9G';

const DEFAULT_SERVICES = [
  { tag: 'Гранит', title: 'Гранитный стандарт', description: 'Классический гранитный памятник с гравировкой имени, дат и фотографии питомца.', price: 'от 45 000 ₸', category: 'Гранитные', order: 1 },
  { tag: 'Мрамор', title: 'Мраморный классик', description: 'Элегантный белый мрамор с индивидуальной надписью и орнаментом.', price: 'от 65 000 ₸', category: 'Мраморные', order: 2 },
  { tag: 'Дерево', title: 'Деревянный крест', description: 'Тёплый деревянный памятный знак ручной работы из натуральных пород.', price: 'от 18 000 ₸', category: 'Деревянные', order: 3 },
  { tag: 'Премиум', title: 'Гранит Премиум', description: 'Премиальный гранит с полировкой, цветным портретом и именной гравировкой.', price: 'от 120 000 ₸', category: 'Гранитные', order: 4 },
  { tag: 'Бюджет', title: 'Именная табличка', description: 'Компактная металлическая табличка с именем и датами — доступный вариант.', price: 'от 8 000 ₸', category: 'Гранитные', order: 5 },
  { tag: 'VIP', title: 'Индивидуальный заказ', description: 'Уникальный памятник по вашему эскизу из любого материала на выбор.', price: 'по запросу', category: 'Индивидуальные', order: 6 },
];

const DEFAULT_DOCUMENTS = [
  { title: 'Публичный договор-оферта', description: 'Регулирует порядок оказания услуг мемориального комплекса.', fileName: 'public_offer_zoozabota.pdf', fileData: MOCK_PDF, fileType: 'application/pdf' },
  { title: 'Правила посещения комплекса', description: 'Правила поведения на территории колумбария и мемориала.', fileName: 'rules_and_regulations.pdf', fileData: MOCK_PDF, fileType: 'application/pdf' },
  { title: 'Политика конфиденциальности', description: 'Правила сбора, обработки и защиты персональных данных.', fileName: 'privacy_policy_zoozabota.pdf', fileData: MOCK_PDF, fileType: 'application/pdf' },
  { title: 'Устав фонда «Өмірге Үміт Бер»', description: 'Учредительный документ общественного фонда.', fileName: 'charter_omirge_umit_ber.pdf', fileData: MOCK_PDF, fileType: 'application/pdf' },
];

let initPromise: Promise<void> | null = null;

export async function ensureTablesExist(sql: ReturnType<typeof neon>) {
  if (!initPromise) {
    initPromise = (async () => {
      console.log('Initializing database tables...');
      // 1. Extensions
      await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;

      // 2. Tables
      await sql`
        CREATE TABLE IF NOT EXISTS pets (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          breed VARCHAR(255) NOT NULL,
          years VARCHAR(100) NOT NULL,
          description TEXT,
          emoji VARCHAR(10) NOT NULL DEFAULT '🐱',
          photo TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS pet_requests (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          breed VARCHAR(255) NOT NULL,
          years VARCHAR(100) NOT NULL,
          description TEXT,
          emoji VARCHAR(10) NOT NULL DEFAULT '🐱',
          photo TEXT,
          email VARCHAR(255),
          status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS services (
          id SERIAL PRIMARY KEY,
          tag VARCHAR(100) NOT NULL,
          title JSONB NOT NULL,
          description JSONB NOT NULL,
          image TEXT,
          price VARCHAR(100),
          category VARCHAR(100),
          sort_order INTEGER NOT NULL DEFAULT 0
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS service_requests (
          id SERIAL PRIMARY KEY,
          service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
          service_title VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          email VARCHAR(255),
          comment TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'rejected')),
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          file_data TEXT NOT NULL,
          file_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
          uploaded_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      // 3. Indexes
      await sql`CREATE INDEX IF NOT EXISTS idx_pets_name_trgm ON pets USING gin (name gin_trgm_ops)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_pets_breed_trgm ON pets USING gin (breed gin_trgm_ops)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_pets_description_trgm ON pets USING gin (description gin_trgm_ops)`;

      // 4. Seed services
      const svcCount = await sql`SELECT COUNT(*)::int as count FROM services`;
      if (Number(svcCount[0].count) === 0) {
        for (const s of DEFAULT_SERVICES) {
          await sql`
            INSERT INTO services (tag, title, description, image, price, category, sort_order)
            VALUES (${s.tag}, ${JSON.stringify(s.title)}, ${JSON.stringify(s.description)}, ${null}, ${s.price}, ${s.category}, ${s.order})
          `;
        }
      }

      // 5. Seed documents
      const docCount = await sql`SELECT COUNT(*)::int as count FROM documents`;
      if (Number(docCount[0].count) === 0) {
        for (const d of DEFAULT_DOCUMENTS) {
          await sql`
            INSERT INTO documents (title, description, file_name, file_data, file_type, uploaded_at)
            VALUES (${d.title}, ${d.description}, ${d.fileName}, ${d.fileData}, ${d.fileType}, NOW())
          `;
        }
      }
      console.log('Database tables initialized successfully!');
    })();
  }
  await initPromise;
}

export async function executeQuery<T>(sql: any, queryFn: () => Promise<T>): Promise<T> {
  try {
    return await queryFn();
  } catch (err: any) {
    if (err.code === '42P01' || (err.message && err.message.toLowerCase().includes('does not exist'))) {
      await ensureTablesExist(sql);
      return await queryFn();
    }
    throw err;
  }
}

