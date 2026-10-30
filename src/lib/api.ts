// API helper for the Expo app
// Uses relative URLs — the Express server serves both the static app
// and the API on port 3000, so no cross-origin or gateway needed.

export async function apiFetch(path: string): Promise<any> {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API fetch error:", err);
    throw err;
  }
}
