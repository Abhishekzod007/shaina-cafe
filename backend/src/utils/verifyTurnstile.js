

export const verifyTurnstile = async (token, ip) => {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    }
  );

  const data = await res.json();
  return data.success === true;
};
