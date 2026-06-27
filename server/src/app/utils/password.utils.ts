/* eslint-disable no-useless-catch */
import { hash, compare } from 'bcrypt';

import { saltRound } from '@/const';

/**
 * Hash a plain password using bcrypt
 */
export async function hashPassword(passwordString: string): Promise<string> {
  try {
    return await hash(passwordString, saltRound);
  } catch (error) {
    throw error;
  }
}

/**
 * Compare plain password with hashed password
 */
export async function comparePassword(
  requestedPassword: string,
  hashPassword: string
): Promise<boolean> {
  try {
    console.log(requestedPassword);
    console.log(hashPassword);
    return await compare(requestedPassword, hashPassword);
  } catch (error) {
    throw error;
  }
}
