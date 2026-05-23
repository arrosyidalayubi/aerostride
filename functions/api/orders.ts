import type { D1Database } from '@cloudflare/workers-types';

interface Env { DB: D1Database; }

// 1. Kita buat cetakan khusus untuk data mentah yang keluar dari SQLite
interface RawOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  date: string;
  items: string; // Di SQLite, ini tersimpan sebagai teks (string)
}

// 2. Kita tidak menggunakan PagesFunction untuk menghindari konflik 'Response' DOM vs Edge
export const onRequestGet = async (context: { env: Env }) => {
  try {
    // 3. KUNCI RAHASIA: Gunakan .all<RawOrder>() agar D1 tahu persis bentuk datanya
    const { results } = await context.env.DB.prepare("SELECT * FROM orders ORDER BY date DESC").all<RawOrder>();
    
    // Karena kita pakai generic di atas, 'r' otomatis dikenali sebagai RawOrder. 
    // ESLint tidak akan meminta 'any' lagi!
    const parsedResults = results.map(r => ({
      ...r,
      items: JSON.parse(r.items)
    }));

    return new Response(JSON.stringify(parsedResults), { 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Kesalahan server';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}