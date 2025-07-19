import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export type AuthTokenPayload = JWTPayload & {
  sub: string;
};

export async function signToken(userId: string): Promise<string | null> {
  try {
    const secret = String(process.env.BETTER_AUTH_SECRET);
    const payload: JWTPayload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000), // Issued at time
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Token expiration (7 days)
    };

    return await sign(payload, secret);
  } catch (error) {
    console.error("Token signing failed:", error);
    return null;
  }
}

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  const secret = String(process.env.TOKEN_SECRET);
  try {
    const payload = (await verify(token, secret)) as AuthTokenPayload;
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
