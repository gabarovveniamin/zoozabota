import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { executeQuery } from './_db/init.js';

const MOCK_PDF = 'JVBERi0xLjQKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDU5NSA4NDIgXQogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDQgMCBSID4+ID4+CiAgICAgL0NvbnRlbnRzIDUgMCBSCiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvVHlwZSAvRm9udAogICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgIC9CYXNlRm9udCAvSGVsdmV0aWNhCiAgPj4KZW5kb2JqCjUgMCBvYmoKICA8PCAvTGVuZ3RoIDQ0ID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooWm9vWmFib3RhIE9mZmljaWFsIERvY3VtZW50KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxNDMgMDAwMDAgbiAKMDAwMDAwMDI3MSAwMDAwMCBuIAowMDAwMDAwMzU1IDAwMDAwIG4gCnRyYWlsZXIKICA8PCAvU2l6ZSA2CiAgICAgL1Jvb3QgMSAwIFIKICA+PgpzdGFydHhyZWYKNDQ4CiUlRU9G';

const DEFAULT_DOCUMENTS: any[] = [];

function mapRow(r: any) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    fileName: r.file_name,
    fileData: r.file_data,
    fileType: r.file_type,
    uploadedAt: r.uploaded_at,
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
      const rows = await executeQuery(sql, () => sql`SELECT * FROM documents ORDER BY uploaded_at DESC`);
      return res.status(200).json(rows.map(mapRow));
    }

    if (req.method === 'POST') {
      const { title, description, fileName, fileData, fileType } = req.body;
      const rows = await executeQuery(sql, () => sql`
        INSERT INTO documents (title, description, file_name, file_data, file_type, uploaded_at)
        VALUES (${title}, ${description}, ${fileName}, ${fileData}, ${fileType}, NOW())
        RETURNING *
      `);
      return res.status(201).json(mapRow(rows[0]));
    }

    if (req.method === 'PUT') {
      const { id, title, description, fileName, fileData, fileType } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const current = await executeQuery(sql, () => sql`SELECT * FROM documents WHERE id = ${id}`);
      if (current.length === 0) return res.status(404).json({ error: 'Not found' });

      const c = current[0] as any;
      await executeQuery(sql, () => sql`
        UPDATE documents SET
          title = ${title ?? c.title},
          description = ${description ?? c.description},
          file_name = ${fileName ?? c.file_name},
          file_data = ${fileData ?? c.file_data},
          file_type = ${fileType ?? c.file_type}
        WHERE id = ${id}
      `);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing id parameter' });
      await executeQuery(sql, () => sql`DELETE FROM documents WHERE id = ${id}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}

