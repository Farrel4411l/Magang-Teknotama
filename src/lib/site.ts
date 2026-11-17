export const SITE_URL = "https://teknotama.com";

export const GAME_BASE_PATH = (
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/games"
).replace(/\/+$/, "");

export function getGamePortalUrl(path = ""): string {
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  return new URL(`${GAME_BASE_PATH}${suffix}/`, SITE_URL)
    .toString()
    .replace(/\/$/, "");
}

export function getGamePortalPath(path = ""): string {
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${GAME_BASE_PATH}${suffix}` || "/";
}
