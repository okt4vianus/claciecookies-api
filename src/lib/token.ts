import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

// TOKEN_SECRET_KEY;

export async function signToken(userId: string) {
  try {
    const secret = String(process.env.TOKEN_SECRET);
    const payload: JWTPayload = {
      subject: userId,
      iat: Math.floor(Date.now() / 1000), // Issued at time
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Token expiration (7 days)
    };

    return await sign(payload, secret);
  } catch (error) {
    console.error("Token signing failed:", error);
    throw new Error("Failed to sign token");
  }
}

export async function verifyToken(token: string) {
  const secret = String(process.env.TOKEN_SECRET);
  try {
    return await verify(token, secret);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid token");
  }
}
