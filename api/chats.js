import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function validPin(pin){ return pin && /^\d{4}$/.test(pin); }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET /api/chats?pin=1234
  if (req.method === 'GET') {
    const { pin } = req.query;
    if (!validPin(pin)) return res.status(400).json({ error: 'Invalid PIN' });
    const { data, error } = await supabase
      .from('chats')
      .select('id, data, updated_at')
      .eq('pin', pin)
      .order('updated_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    const result = {};
    (data || []).forEach(row => {
      result[row.id] = { ...row.data, updatedAt: new Date(row.updated_at).getTime() };
    });
    return res.json(result);
  }

  // POST /api/chats — upsert chat
  if (req.method === 'POST') {
    const { pin, id, ...chatData } = req.body || {};
    if (!validPin(pin)) return res.status(400).json({ error: 'Invalid PIN' });
    if (!id) return res.status(400).json({ error: 'Missing chat id' });
    const { error } = await supabase.from('chats').upsert({
      id,
      pin,
      data: chatData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id,pin' });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  // DELETE /api/chats?pin=1234&id=xxx
  if (req.method === 'DELETE') {
    const { pin, id } = req.query;
    if (!validPin(pin)) return res.status(400).json({ error: 'Invalid PIN' });
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const { error } = await supabase.from('chats').delete().eq('id', id).eq('pin', pin);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  res.status(405).end();
}
