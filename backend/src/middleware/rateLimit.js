import rateLimit from "express-rate-limit";

// 🌐 General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                // 300 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later.",
  },
});

// 🔐 Auth limiter (login/signup)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // strict
  message: {
    error: "Too many login attempts. Try again later.",
  },
});

// 🛒 Order limiter (order spam protection)
export const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50, // max 50 orders per IP per 10 min
  message: {
    error: "Too many orders from this IP. Please wait.",
  },
});
