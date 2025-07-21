/**
 * Legacy code. Because we're using scrypt via Better-Auth
 *
 * https://better-auth.com/docs/authentication/email-password#configuration
 */

export function hashPassword(password: string) {
  return Bun.password.hash(password, {
    algorithm: "argon2id",
  });
}

export function verifyPassword(password: string, hash: string) {
  return Bun.password.verify(password, hash);
}
