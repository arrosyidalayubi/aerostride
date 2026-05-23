type ProductsRequestContext = {
  env: {
    DB: {
      prepare(query: string): {
        all(): Promise<{ results: Record<string, unknown>[] }>;
      };
    };
  };
};

export async function onRequestGet(context: ProductsRequestContext) {
  try {
    // Memanggil database D1 menggunakan binding "DB"
    const { results } = await context.env.DB.prepare("SELECT * FROM products").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(message, { status: 500 });
  }
}