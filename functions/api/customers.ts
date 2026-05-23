// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestGet(context: any) {
  try {
    const { results } = await context.env.DB.prepare("SELECT * FROM customers ORDER BY joinDate DESC").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}