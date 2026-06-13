import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envPassword) {
      return res.status(500).json({ error: 'ADMIN_PASSWORD environment variable is not defined. Please define it in Vercel settings or local .env file.' });
    }

    if (password === envPassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: 'Неверный пароль' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
