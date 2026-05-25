import type { D1Database } from '@cloudflare/workers-types';

// Deklarasi Lingkungan Database
interface Env { DB: D1Database; }

interface OfflineSalePayload {
  id: string;
  itemCode: string;
  productName: string;
  qty: number;
  totalPrice: number;
  cabang: string;
  date: string;
}

// ==========================================
// 1. FUNGSI GET: Menarik Riwayat Nota
// ==========================================
export const onRequestGet = async (context: { env: Env }) => {
  try {
    const { results } = await context.env.DB.prepare("SELECT * FROM offline_sales ORDER BY id DESC").all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Kesalahan server';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}

// ==========================================
// 2. FUNGSI POST: Kasir Mencatat Transaksi (Potong Stok)
// ==========================================
export const onRequestPost = async (context: { env: Env, request: Request }) => {
  try {
    const data = (await context.request.json()) as OfflineSalePayload;
    const db = context.env.DB;

    // Cek Ketersediaan Stok Fisik
    const product = await db.prepare("SELECT stock, threshold FROM products WHERE id = ?").bind(data.itemCode).first<{stock: number, threshold: number}>();
    
    if (!product || product.stock < data.qty) {
      return new Response(JSON.stringify({ error: "Gagal: Stok fisik di database pusat tidak mencukupi!" }), { status: 400 });
    }

    const newStock = product.stock - data.qty;
    const newStatus = newStock <= 5 ? 'Critical' : newStock <= product.threshold ? 'Low Stock' : 'In Stock';

    // Eksekusi Batch (Ubah Stok + Catat Nota)
    await db.batch([
      db.prepare("UPDATE products SET stock = ?, status = ? WHERE id = ?").bind(newStock, newStatus, data.itemCode),
      db.prepare("INSERT INTO offline_sales (id, itemCode, productName, qty, totalPrice, cabang, date) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(data.id, data.itemCode, data.productName, data.qty, data.totalPrice, data.cabang, data.date)
    ]);

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, headers: { "Content-Type": "application/json" } 
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Kesalahan internal server';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}

// ==========================================
// 3. FUNGSI DELETE: Batalkan Transaksi (Kembalikan Stok)
// ==========================================
export const onRequestDelete = async (context: { env: Env, request: Request }) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const db = context.env.DB;

  try {
    // Cari data nota yang mau dihapus untuk tahu barang apa dan berapa qty-nya
    const trx = await db.prepare("SELECT itemCode, qty FROM offline_sales WHERE id = ?").bind(id).first<{itemCode: string, qty: number}>();
    
    if (!trx) return new Response(JSON.stringify({ error: "Nota tidak ditemukan" }), { status: 404 });

    // Eksekusi Batch: Kembalikan Stok Gudang Hapus Nota
    // (Jika ini sukses, Trigger D1 akan otomatis mengurangi Laporan Harian!)
    await db.batch([
      db.prepare("UPDATE products SET stock = stock + ? WHERE id = ?").bind(trx.qty, trx.itemCode),
      db.prepare("DELETE FROM offline_sales WHERE id = ?").bind(id)
    ]);

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal membatalkan transaksi';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}