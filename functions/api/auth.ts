import type { D1Database } from '@cloudflare/workers-types';

interface Env { DB: D1Database; }

export const onRequestPost = async (context: { env: Env, request: Request }) => {
  try {
    const { email, password } = (await context.request.json()) as {email: string, password: string};
    
    if (email === 'admin@aerostride.id' && password === 'admin123') {
      return new Response(JSON.stringify({ 
        success: true, 
        user: { name: 'Administrator Eksekutif', role: 'admin' } 
      }), { headers: { "Content-Type": "application/json" } });
    }

    // 2. CEK PELANGGAN DI DATABASE D1
    const db = context.env.DB;
    const customer = await db.prepare("SELECT name FROM customers WHERE email = ? AND password = ?")
      .bind(email, password)
      .first<{name: string}>();

    if (customer) {
      // Jika cocok, kembalikan nama asli dari database!
      return new Response(JSON.stringify({ 
        success: true, 
        user: { name: customer.name, role: 'customer' } 
      }), { headers: { "Content-Type": "application/json" } });
    }

    // 3. JIKA GAGAL LOGIN
    return new Response(JSON.stringify({ error: 'Email atau kata sandi tidak valid.' }), { status: 401 });

  } catch {
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan pada server.' }), { status: 500 });
  }
}