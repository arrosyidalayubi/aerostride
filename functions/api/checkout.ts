import type { D1Database } from '@cloudflare/workers-types';

interface Env { DB: D1Database; }

// Cetakan untuk isi keranjang
interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

// Cetakan untuk payload saat checkout
interface CheckoutPayload {
  id: string;
  customerName: string;
  date: string;
  totalAmount: number;
  items: CartItem[];
}

export const onRequestPost = async (context: { env: Env, request: Request }) => {
  try {
    // Gunakan Type Assertion agar ESLint dan TypeScript tidak marah
    const data = (await context.request.json()) as CheckoutPayload; 
    const db = context.env.DB;

    // 1. Simpan ke tabel 'orders'
    // CATATAN: Begitu ini sukses, Trigger D1 akan OTOMATIS mengisi 'daily_sales'
    await db.prepare("INSERT INTO orders (id, customerName, date, totalAmount, status, items) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(
        data.id, 
        data.customerName || 'Pelanggan', 
        data.date, 
        data.totalAmount, 
        'Pending', // Status default
        JSON.stringify(data.items) // Ubah array keranjang jadi string agar bisa masuk database
      ).run();

    // 2. Kurangi Stok Fisik di tabel 'products'
    // Kita gunakan looping untuk mengurangi stok setiap barang di keranjang
    if (data.items && data.items.length > 0) {
      const statements = data.items.map((item: CartItem) =>
        db.prepare("UPDATE products SET stock = stock - ? WHERE name = ?").bind(item.qty, item.name)
      );
      // Eksekusi semua pengurangan stok sekaligus (Batch)
      await db.batch(statements);
    }

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  
  } catch (err: unknown) {
    // Jika meledak, kirimkan pesan error aslinya agar kita tahu salahnya di mana
    return new Response(JSON.stringify({ error: `Gagal Checkout: ${ (err as Error).message }` }), { status: 500 });
  }
}