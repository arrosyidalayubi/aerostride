interface D1Database {
  prepare(query: string): { all(): Promise<{ results: Record<string, unknown>[] }> };
}

interface Env { DB: D1Database; }

type PagesFunction<T> = (context: { env: T }) => Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare("SELECT * FROM daily_sales ORDER BY date ASC").all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Kesalahan server';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}