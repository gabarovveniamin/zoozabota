import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery } from './_db/init.js';

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
    title: parseJsonbField(r.title),
    description: parseJsonbField(r.description),
    price: parseJsonbField(r.price),
    image: r.image,
    status: r.status,
    category: r.category,
    createdAt: r.created_at,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database configuration missing.' });
  }

  try {
    const sql = neon(databaseUrl);

    if (req.method === 'GET') {
      const rows = await executeQuery(sql, () => sql`SELECT * FROM shop_items ORDER BY created_at DESC`);
      return res.status(200).json(rows.map(mapRow));
    }

    if (req.method === 'POST') {
      const { title, description, price, image, status, category } = req.body;
      const rows = await executeQuery(sql, () => sql`
        INSERT INTO shop_items (title, description, price, image, status, category)
        VALUES (${JSON.stringify(title)}, ${JSON.stringify(description)}, ${JSON.stringify(price)}, ${image ?? null}, ${status ?? 'in_stock'}, ${category ?? null})
        RETURNING *
      `);
      return res.status(201).json(mapRow(rows[0]));
    }

    if (req.method === 'PUT') {
      const { id, title, description, price, image, status, category } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const current = await executeQuery(sql, () => sql`SELECT * FROM shop_items WHERE id = ${id}`);
      if (current.length === 0) return res.status(404).json({ error: 'Not found' });

      const c = current[0] as any;
      await executeQuery(sql, () => sql`
        UPDATE shop_items SET
          title = ${title !== undefined ? JSON.stringify(title) : c.title},
          description = ${description !== undefined ? JSON.stringify(description) : c.description},
          price = ${price !== undefined ? JSON.stringify(price) : c.price},
          image = ${image !== undefined ? image : c.image},
          status = ${status !== undefined ? status : c.status},
          category = ${category !== undefined ? category : c.category}
        WHERE id = ${id}
      `);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing id parameter' });
      await executeQuery(sql, () => sql`DELETE FROM shop_items WHERE id = ${id}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
