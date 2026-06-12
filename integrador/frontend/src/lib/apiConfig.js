// URL base da API.
// - Em desenvolvimento, usa http://localhost:3000 por padrão.
// - Em produção/deploy, defina NEXT_PUBLIC_API_URL (ex.: na Vercel/Railway)
//   com a URL pública do backend, sem precisar editar este arquivo.
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:3000';
