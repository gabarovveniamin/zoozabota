import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery } from './_db/init.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Neither DATABASE_URL nor POSTGRES_URL environment variables are defined. Please link your Neon database in Vercel settings.' });
  }

  try {
    const sql = neon(databaseUrl);

    if (req.method === 'GET') {
      const rows = await executeQuery(sql, () => sql`SELECT * FROM settings`);
      const settingsMap: Record<string, string> = {};
      rows.forEach((r: any) => {
        settingsMap[r.key] = r.value;
      });
      return res.status(200).json(settingsMap);
    }

    if (req.method === 'PUT') {
      const body = req.body as Record<string, string>;
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid settings body' });
      }

      await executeQuery(sql, async () => {
        for (const [key, val] of Object.entries(body)) {
          await sql`
            INSERT INTO settings (key, value)
            VALUES (${key}, ${String(val)})
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
          `;
        }
      });

      // Fetch and return the updated settings map
      const rows = await executeQuery(sql, () => sql`SELECT * FROM settings`);
      const settingsMap: Record<string, string> = {};
      rows.forEach((r: any) => {
        settingsMap[r.key] = r.value;
      });
      return res.status(200).json(settingsMap);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
