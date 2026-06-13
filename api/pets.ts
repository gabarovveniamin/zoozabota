import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery } from './db/init.js';

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
      const rows = await executeQuery(sql, () => sql`SELECT * FROM pets ORDER BY created_at DESC`);
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
    }

    if (req.method === 'POST') {
      const { name, breed, years, description, emoji, photo } = req.body;
      const rows = await executeQuery(sql, () => sql`
        INSERT INTO pets (name, breed, years, description, emoji, photo, created_at)
        VALUES (${name}, ${breed}, ${years}, ${description ?? null}, ${emoji}, ${photo ?? null}, NOW())
        RETURNING *
      `);
      const r = rows[0] as any;
      return res.status(201).json({
        id: r.id,
        name: r.name,
        breed: r.breed,
        years: r.years,
        description: r.description,
        emoji: r.emoji,
        photo: r.photo,
        createdAt: r.created_at,
      });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing id parameter' });
      await executeQuery(sql, () => sql`DELETE FROM pets WHERE id = ${id}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}

