// The app API (Aeko_backend). Overridable per environment in Vercel with
// NEXT_PUBLIC_API_BASE_URL; the default is the production host so a missing
// variable never points at a dead one (dev.aeko.online stopped answering).
export const API_BASE_URL = (
	process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.aeko.online"
).replace(/\/+$/, "");
