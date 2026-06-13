import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery } from './db/init';

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
          similarity(name, ${q}),
          similarity(breed, ${q}),
          similarity(COALESCE(description, ''), ${q})
        ) as sim
      FROM pets
      WHERE name % ${q} OR breed % ${q} OR COALESCE(description, '') % ${q}
      ORDER BY sim DESC
    `);

    const pets = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      breed: r.breed,
      years: r.years,
      description: r.description,
      emoji: r.emoji,
      photo: r.photo,
      createdAt: r.created_at,
    }));

    return res.status(200).json(pets);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}

