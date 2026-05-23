interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  first(): Promise<unknown>;
}

interface D1Database {
  prepare(sql: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown>;
}

interface PagesContext {
  request: Request;
  env: {
    DB: D1Database | Record<string, unknown>; // Menampung binding database
  };
}

export async function onRequestPost(context: PagesContext) {
  try {
    const data = await context.request.json();
    const db = context.env.DB;
    if (!db || typeof (db as D1Database).prepare !== "function") {
      return new Response(JSON.stringify({ error: "Database tidak tersedia" }), { status: 500 });
    }
    const d1db = db as D1Database;

    // 1. Cek ketersediaan stok
    const product = await d1db.prepare("SELECT stock FROM products WHERE id = ?").bind(data.sku).first() as { stock: number } | null;
    if (!product || product.stock < data.qty) {
      return new Response(JSON.stringify({ error: "Stok tidak mencukupi" }), { status: 400 });
    }

    const newStock = product.stock - data.qty;
    const newStatus = newStock <= 5 ? 'Critical' : 'In Stock';

    // 2. Lakukan Update Stok dan Insert Order secara berurutan
    const batch = await d1db.batch([
      d1db.prepare("UPDATE products SET stock = ?, status = ? WHERE id = ?").bind(newStock, newStatus, data.sku),
      d1db.prepare("INSERT INTO orders (id, customerName, totalAmount, status, date) VALUES (?, ?, ?, ?, ?)")
        .bind(data.orderId, data.customerName, data.totalAmount, "Packing", data.date)
    ]);

    return new Response(JSON.stringify({ success: true, batch }), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}