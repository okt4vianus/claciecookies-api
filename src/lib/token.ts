import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export async function signToken(userId: string) {
  try {
    const secret = String(process.env.TOKEN_SECRET_KEY);
    const payload: JWTPayload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      // Token expires in 7 days
    };
    return await sign(payload, secret);
  } catch (error) {
    console.error("Token signing failed:", error);
    throw new Error("Failed to sign token");
  }
}

export async function verifyToken(token: string) {
  try {
    const secret = String(process.env.TOKEN_SECRET_KEY);
    const payload = await verify(token, secret);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid token");
  }
}
