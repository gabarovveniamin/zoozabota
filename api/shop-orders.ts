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
    items: parseJsonbField(r.items),
    customerName: r.customer_name,
    customerPhone: r.customer_phone,
    customerEmail: r.customer_email,
    deliveryAddress: r.delivery_address,
    totalPrice: r.total_price,
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
    return res.status(500).json({ error: 'Database configuration missing.' });
  }

  try {
    const sql = neon(databaseUrl);

    if (req.method === 'GET') {
      const rows = await executeQuery(sql, () => sql`SELECT * FROM shop_orders ORDER BY created_at DESC`);
      return res.status(200).json(rows.map(mapRow));
    }

    if (req.method === 'POST') {
      const { items, customerName, customerPhone, customerEmail, deliveryAddress, totalPrice, status } = req.body;
      const rows = await executeQuery(sql, () => sql`
        INSERT INTO shop_orders (items, customer_name, customer_phone, customer_email, delivery_address, total_price, status)
        VALUES (${JSON.stringify(items)}, ${customerName}, ${customerPhone}, ${customerEmail ?? null}, ${deliveryAddress ?? null}, ${totalPrice}, ${status ?? 'pending'})
        RETURNING *
      `);
      return res.status(201).json(mapRow(rows[0]));
    }

    if (req.method === 'PUT') {
      const { id, items, customerName, customerPhone, customerEmail, deliveryAddress, totalPrice, status } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const current = await executeQuery(sql, () => sql`SELECT * FROM shop_orders WHERE id = ${id}`);
      if (current.length === 0) return res.status(404).json({ error: 'Not found' });

      const c = current[0] as any;
      await executeQuery(sql, () => sql`
        UPDATE shop_orders SET
          items = ${items !== undefined ? JSON.stringify(items) : c.items},
          customer_name = ${customerName !== undefined ? customerName : c.customer_name},
          customer_phone = ${customerPhone !== undefined ? customerPhone : c.customer_phone},
          customer_email = ${customerEmail !== undefined ? customerEmail : c.customer_email},
          delivery_address = ${deliveryAddress !== undefined ? deliveryAddress : c.delivery_address},
          total_price = ${totalPrice !== undefined ? totalPrice : c.total_price},
          status = ${status !== undefined ? status : c.status}
        WHERE id = ${id}
      `);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing id parameter' });
      await executeQuery(sql, () => sql`DELETE FROM shop_orders WHERE id = ${id}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
