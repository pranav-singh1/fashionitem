export async function fetchFashionPiece(seed) {
  try {
    const res = await fetch('http://localhost:5050/api/fashion-piece', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed }),
    });
    if (!res.ok) {
      return {
        brand: "Error",
        designer: "Error",
        category: "Error",
        color: "Error",
        description: "Could not fetch from backend",
      };
    }
    return await res.json();
  } catch (e) {
    return {
      brand: "Error",
      designer: "Error",
      category: "Error",
      color: "Error",
      description: "Network or server error",
    };
  }
}