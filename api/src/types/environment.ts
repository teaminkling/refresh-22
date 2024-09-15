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
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
  AWS_S3_BUCKET: string;
  TWIC_URL: string;
  CDN_HOSTNAME: string;
  ENVIRONMENT: string;
}
