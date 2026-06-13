import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery, ensureTablesExist } from './db/init.js';

const DEFAULT_SERVICES = [
  { tag: 'Гранит', title: 'Гранитный стандарт', description: 'Классический гранитный памятник с гравировкой имени, дат и фотографии питомца.', price: 'от 45 000 ₸', category: 'Гранитные', order: 1 },
  { tag: 'Мрамор', title: 'Мраморный классик', description: 'Элегантный белый мрамор с индивидуальной надписью и орнаментом.', price: 'от 65 000 ₸', category: 'Мраморные', order: 2 },
  { tag: 'Дерево', title: 'Деревянный крест', description: 'Тёплый деревянный памятный знак ручной работы из натуральных пород.', price: 'от 18 000 ₸', category: 'Деревянные', order: 3 },
  { tag: 'Премиум', title: 'Гранит Премиум', description: 'Премиальный гранит с полировкой, цветным портретом и именной гравировкой.', price: 'от 120 000 ₸', category: 'Гранитные', order: 4 },
  { tag: 'Бюджет', title: 'Именная табличка', description: 'Компактная металлическая табличка с именем и датами — доступный вариант.', price: 'от 8 000 ₸', category: 'Гранитные', order: 5 },
  { tag: 'VIP', title: 'Индивидуальный заказ', description: 'Уникальный памятник по вашему эскизу из любого материала на выбор.', price: 'по запросу', category: 'Индивидуальные', order: 6 },
];

function parseJsonbField(val: any): any {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === 'string') return parsed;
      return parsed;
    } catch {
      return val;
    }
  }
  return val;
}

function mapRow(r: any) {
  return {
    id: r.id,
    tag: r.tag,
    title: parseJsonbField(r.title),
    description: parseJsonbField(r.description),
    image: r.image,
    price: r.price,
    category: r.category,
    order: r.sort_order,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Neither DATABASE_URL nor POSTGRES_URL environment variables are defined. Please link your Neon database in Vercel settings.' });
  }
  try {
    const sql = neon(databaseUrl);
    if (req.method === 'GET') {
      let rows = await executeQuery(sql, () => sql`SELECT * FROM services ORDER BY sort_order ASC`);

      if (rows.length === 0) {
        for (const s of DEFAULT_SERVICES) {
          await executeQuery(sql, () => sql`
            INSERT INTO services (tag, title, description, image, price, category, sort_order)
            VALUES (${s.tag}, ${JSON.stringify(s.title)}, ${JSON.stringify(s.description)}, ${null}, ${s.price}, ${s.category}, ${s.order})
          `);
        }
        rows = await executeQuery(sql, () => sql`SELECT * FROM services ORDER BY sort_order ASC`);
      }

      return res.status(200).json(rows.map(mapRow));
    }

    if (req.method === 'POST') {
      const { tag, title, description, image, price, category, order } = req.body;
      const rows = await executeQuery(sql, () => sql`
        INSERT INTO services (tag, title, description, image, price, category, sort_order)
        VALUES (${tag}, ${JSON.stringify(title)}, ${JSON.stringify(description)}, ${image ?? null}, ${price ?? null}, ${category ?? null}, ${order})
        RETURNING *
      `);
      return res.status(201).json(mapRow(rows[0]));
    }

    if (req.method === 'PUT') {
      const { id, tag, title, description, image, price, category, order } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const current = await executeQuery(sql, () => sql`SELECT * FROM services WHERE id = ${id}`);
      if (current.length === 0) return res.status(404).json({ error: 'Not found' });

      const c = current[0] as any;
      await executeQuery(sql, () => sql`
        UPDATE services SET
          tag = ${tag ?? c.tag},
          title = ${title !== undefined ? JSON.stringify(title) : c.title},
          description = ${description !== undefined ? JSON.stringify(description) : c.description},
          image = ${image !== undefined ? image : c.image},
          price = ${price !== undefined ? price : c.price},
          category = ${category !== undefined ? category : c.category},
          sort_order = ${order !== undefined ? order : c.sort_order}
        WHERE id = ${id}
      `);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing id parameter' });
      await executeQuery(sql, () => sql`DELETE FROM services WHERE id = ${id}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}

