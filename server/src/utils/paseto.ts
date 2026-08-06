import { V4 } from 'paseto';
import { config } from '../config';
import type { UserPayload } from '../types';

export interface PasetoTokenPayload {
  sub: string; // userId
  name: string;
  email: string;
  avatarUrl?: string;
  iat?: string;
  exp?: string;
}

export async function generateAccessToken(user: UserPayload): Promise<string> {
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? ''
  };

  const token = await V4.sign(payload, config.PASETO_SECRET_KEY, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES_IN
  });

  return token;
}

export async function verifyAccessToken(token: string): Promise<PasetoTokenPayload | null> {
  try {
    const payload = (await V4.verify(token, config.PASETO_PUBLIC_KEY)) as PasetoTokenPayload;
    return payload;
  } catch (err) {
    return null;
  }
}
