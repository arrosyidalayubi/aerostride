interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | undefined>;
  all(): Promise<D1Result>;
}

interface D1Result {
  results: unknown[];
}

interface Env { DB: D1Database; }

type PagesFunction<E> = (context: { env: E; request: Request }) => Promise<Response>;

// FUNGSI GET: Menarik Riwayat Transaksi Offline saat web dibuka
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare("SELECT * FROM offline_sales ORDER BY id DESC").all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Kesalahan server';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}

// FUNGSI POST: Menerima Transaksi Baru dari Kasir
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json() as {
      id: string; itemCode: string; productName: string; qty: number; totalPrice: number; cabang: string; date: string;
    };
    const db = context.env.DB;

    // 1. Cek Ketersediaan Stok Terkini di Database
    const product = await db.prepare("SELECT stock, threshold FROM products WHERE id = ?").bind(data.itemCode).first<{stock: number, threshold: number}>();
    
    if (!product || product.stock < data.qty) {
      return new Response(JSON.stringify({ error: "Gagal: Stok fisik di database pusat tidak mencukupi!" }), { status: 400 });
    }

    // 2. Kalkulasi Status Stok Baru
    const newStock = product.stock - data.qty;
    const newStatus = newStock <= 5 ? 'Critical' : newStock <= product.threshold ? 'Low Stock' : 'In Stock';

    // 3. EKSEKUSI BATCH (Jika salah satu gagal, Cloudflare membatalkan keduanya)
    await db.batch([
      db.prepare("UPDATE products SET stock = ?, status = ? WHERE id = ?").bind(newStock, newStatus, data.itemCode),
      db.prepare("INSERT INTO offline_sales (id, itemCode, productName, qty, totalPrice, cabang, date) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(data.id, data.itemCode, data.productName, data.qty, data.totalPrice, data.cabang, data.date)
    ]);

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Kesalahan internal server';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}