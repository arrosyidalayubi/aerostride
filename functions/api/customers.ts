// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestGet(context: any) {
  try {
    const { results } = await context.env.DB.prepare("SELECT * FROM customers ORDER BY joinDate DESC").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// === TAMBAHKAN FUNGSI POST INI DI BAWAHNYA ===

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestPost(context: any) {
  try {
    // 1. Tangkap data JSON yang dikirim dari React
    const data = await context.request.json();
    const db = context.env.DB;

    // 2. Eksekusi query INSERT ke tabel customers D1
    await db.prepare("INSERT INTO customers (id, name, email, phone, joinDate) VALUES (?, ?, ?, ?, ?)")
      .bind(data.id, data.name, data.email, data.phone, data.joinDate)
      .run();

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}