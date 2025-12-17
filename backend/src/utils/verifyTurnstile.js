export const verifyTurnstile = async (token) => {
  try {
    if (!token) return false;

    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET;

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
        }),
      }
    );

    if (!res.ok) {
      console.error("Turnstile HTTP error:", res.status);
      return false;
    }

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false; // 🔥 NEVER throw
  }
};
