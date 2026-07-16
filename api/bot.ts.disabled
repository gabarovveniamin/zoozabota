import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processUpdate } from '../telegram-bot/bot.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set headers for CORS just in case
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Telegram webhook only sends POST requests
  if (req.method === 'POST') {
    try {
      const update = req.body;
      if (update) {
        await processUpdate(update);
      }
      return res.status(200).json({ ok: true });
    } catch (err: any) {
      console.error('Error handling Telegram Webhook:', err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  // Simple GET request response to verify webhook endpoint is alive
  if (req.method === 'GET') {
    return res.status(200).send('ZooZabota Telegram Webhook Endpoint is active.');
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
