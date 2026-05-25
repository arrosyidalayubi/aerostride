import type { D1Database } from '@cloudflare/workers-types';

interface Env { DB: D1Database; }

interface CustomerPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Tanda tanya berarti opsional (bisa kosong)
}

// ==========================================
// 1. TARIK DATA PELANGGAN (GET)
// ==========================================
export const onRequestGet = async (context: { env: Env }) => {
  try {
    // KUNCI KEAMANAN: Jangan pernah men-SELECT kolom 'password' untuk dikirim ke Frontend!
    const { results } = await context.env.DB.prepare("SELECT id, name, email, phone, joinDate FROM customers ORDER BY joinDate DESC").all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Kesalahan server';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}

// ==========================================
// 2. TAMBAH PELANGGAN MANUAL (POST)
// ==========================================
export const onRequestPost = async (context: { env: Env, request: Request }) => {
  try {
    const data = (await context.request.json()) as CustomerPayload;
    const db = context.env.DB;

    const defaultPassword = data.password ? data.password : 'aerostride123';
    
    const today = new Date();
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const joinDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    await db.prepare("INSERT INTO customers (id, name, email, password, phone, joinDate) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(data.id, data.name, data.email, defaultPassword, data.phone, joinDate).run();

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  
  } catch (err: unknown) {
    // TANGKAP ERROR UNIQUE DI SINI
    if ((err as Error).message && (err as Error).message.includes('UNIQUE constraint failed: customers.email')) {
      return new Response(JSON.stringify({ error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau coba Masuk.' }), { status: 400 });
    }
    
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
}

// ==========================================
// 3. HAPUS PELANGGAN (DELETE)
// ==========================================
export const onRequestDelete = async (context: { env: Env, request: Request }) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  
  try {
    await context.env.DB.prepare("DELETE FROM customers WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: 'Gagal menghapus' }), { status: 500 });
  }
}