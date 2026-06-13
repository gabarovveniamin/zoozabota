import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery } from './db/init.js';

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
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const q = req.query.q as string;
    if (!q) return res.status(400).json({ error: 'Missing q parameter' });

    const rows = await executeQuery(sql, () => sql`
      SELECT *,
        GREATEST(
          similarity(tag, ${q}),
          similarity(COALESCE(category, ''), ${q}),
          similarity(
            CASE
              WHEN jsonb_typeof(title) = 'object' THEN
                COALESCE(title->>'ru', '') || ' ' || COALESCE(title->>'kz', '') || ' ' || COALESCE(title->>'en', '')
              ELSE COALESCE(title#>>'{}', '')
            END,
            ${q}
          ),
          similarity(
            CASE
              WHEN jsonb_typeof(description) = 'object' THEN
                COALESCE(description->>'ru', '') || ' ' || COALESCE(description->>'kz', '') || ' ' || COALESCE(description->>'en', '')
              ELSE COALESCE(description#>>'{}', '')
            END,
            ${q}
          )
        ) as sim
      FROM services
      WHERE
        tag % ${q} OR
        COALESCE(category, '') % ${q} OR
        (CASE
          WHEN jsonb_typeof(title) = 'object' THEN
            COALESCE(title->>'ru', '') || ' ' || COALESCE(title->>'kz', '') || ' ' || COALESCE(title->>'en', '')
          ELSE COALESCE(title#>>'{}', '')
        END) % ${q} OR
        (CASE
          WHEN jsonb_typeof(description) = 'object' THEN
            COALESCE(description->>'ru', '') || ' ' || COALESCE(description->>'kz', '') || ' ' || COALESCE(description->>'en', '')
          ELSE COALESCE(description#>>'{}', '')
        END) % ${q}
      ORDER BY sim DESC
    `);

    return res.status(200).json(rows.map(mapRow));
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
