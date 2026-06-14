import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery, hashPassword } from './db/init.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Neither DATABASE_URL nor POSTGRES_URL environment variables are defined. Please link your Neon database in Vercel settings.' });
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { firstName, lastName, phone, password } = req.body;

    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = neon(databaseUrl);

    // Normalize phone number to digits only for reliable lookup
    const normalizedPhone = phone.replace(/\D/g, '');

    // Check if phone number already exists
    const allUsers = await executeQuery(sql, () => sql`SELECT id, phone FROM users`);
    const isDuplicate = allUsers.some((u: any) => u.phone.replace(/\D/g, '') === normalizedPhone);

    if (isDuplicate) {
      return res.status(409).json({ error: 'Пользователь с таким номером телефона уже зарегистрирован' });
    }

    // Hash the password
    const hashed = hashPassword(password);

    // Insert user
    const inserted = await executeQuery(sql, () => sql`
      INSERT INTO users (first_name, last_name, phone, password_hash)
      VALUES (${firstName}, ${lastName}, ${phone}, ${hashed})
      RETURNING id, first_name, last_name, phone
    `);

    const user = inserted[0];
    return res.status(201).json({
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
