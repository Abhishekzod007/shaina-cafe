// src/utils/generateOrderId.js
export function generateOrderId() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SH-${t}-${r}`;
}
