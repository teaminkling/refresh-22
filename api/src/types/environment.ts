/**
 * The environment for this Worker.
 */
export default interface Environment {
  REFRESH_KV: KVNamespace;
  ALLOWED_ORIGIN: string;
  JWKS_URL: string;
  AUDIENCE: string;
  WEEKS_DISCORD_URL: string;
  WORKS_DISCORD_URL: string;
}
