import type { D1Database } from '@cloudflare/workers-types';
interface Env { DB: D1Database; }

interface DailyPayload {
  id: string; date: string; month: string; 
  trxOnline: number; omzetOnline: number; 
  trxJakarta: number; omzetJakarta: number; 
  trxBandung: number; omzetBandung: number; 
  totalTrx: number; totalOmzet: number;
}

// PERBAIKAN: Hapus PagesFunction, gunakan (context: { env: Env })
export const onRequestGet = async (context: { env: Env }) => {
  const { results } = await context.env.DB.prepare("SELECT * FROM daily_sales ORDER BY substr(date, 7, 4) DESC, substr(date, 4, 2) DESC, substr(date, 1, 2) DESC").all();
  return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
}

export const onRequestPost = async (context: { env: Env, request: Request }) => {
  const data = (await context.request.json()) as DailyPayload;
  await context.env.DB.prepare("INSERT INTO daily_sales (id, date, month, trxOnline, omzetOnline, trxJakarta, omzetJakarta, trxBandung, omzetBandung, totalTrx, totalOmzet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(data.id, data.date, data.month, data.trxOnline, data.omzetOnline, data.trxJakarta, data.omzetJakarta, data.trxBandung, data.omzetBandung, data.totalTrx, data.totalOmzet).run();
  return new Response(JSON.stringify({ success: true }));
}

export const onRequestPut = async (context: { env: Env, request: Request }) => {
  const data = (await context.request.json()) as DailyPayload;
  await context.env.DB.prepare("UPDATE daily_sales SET trxOnline=?, omzetOnline=?, trxJakarta=?, omzetJakarta=?, trxBandung=?, omzetBandung=?, totalTrx=?, totalOmzet=? WHERE id=?")
    .bind(data.trxOnline, data.omzetOnline, data.trxJakarta, data.omzetJakarta, data.trxBandung, data.omzetBandung, data.totalTrx, data.totalOmzet, data.id).run();
  return new Response(JSON.stringify({ success: true }));
}

export const onRequestDelete = async (context: { env: Env, request: Request }) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  await context.env.DB.prepare("DELETE FROM daily_sales WHERE id = ?").bind(id).run();
  return new Response(JSON.stringify({ success: true }));
}