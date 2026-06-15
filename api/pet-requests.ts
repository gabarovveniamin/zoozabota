import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery } from './_db/init.js';
import { sendTelegramNotification } from './_utils/telegram.js';

function mapRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    breed: r.breed,
    years: r.years,
    description: r.description,
    emoji: r.emoji,
    photo: r.photo,
    email: r.email,
    status: r.status,
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
    return res.status(500).json({ error: 'Neither DATABASE_URL nor POSTGRES_URL environment variables are defined. Please link your Neon database in Vercel settings.' });
  }
  try {
    const sql = neon(databaseUrl);
    if (req.method === 'GET') {
      const id = req.query.id as string | undefined;
      if (id) {
        const rows = await executeQuery(sql, () => sql`SELECT * FROM pet_requests WHERE id = ${id}`);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(mapRow(rows[0]));
      }
      const rows = await executeQuery(sql, () => sql`SELECT * FROM pet_requests ORDER BY created_at DESC`);
      return res.status(200).json(rows.map(mapRow));
    }

    if (req.method === 'POST') {
      const { name, breed, years, description, emoji, photo, email } = req.body;
      const rows = await executeQuery(sql, () => sql`
        INSERT INTO pet_requests (name, breed, years, description, emoji, photo, email, status, created_at)
        VALUES (${name}, ${breed}, ${years}, ${description ?? null}, ${emoji}, ${photo ?? null}, ${email ?? null}, 'pending', NOW())
        RETURNING *
      `);
      
      // Send Telegram notification (await it to ensure Vercel doesn't freeze the process)
      try {
        await sendTelegramNotification('pet', rows[0]);
      } catch (err) {
        console.error('Failed to send telegram notification for pet request:', err);
      }

      return res.status(201).json(mapRow(rows[0]));
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'Missing id or status' });
      await executeQuery(sql, () => sql`UPDATE pet_requests SET status = ${status} WHERE id = ${id}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}

