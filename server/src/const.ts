export const corsWhiteList = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:3006',
  'http://localhost:3007',
  'http://localhost:3008',
  'http://10.10.10.26:3008',
  'http://10.10.10.26:3000',
  'http://10.10.28.21:3001',
  'http://10.10.28.21:3002',
];
export const saltRound = 10;
/**
 * ========================================
 * -------------- REGEX'S -----------------
 * ========================================
 */
export const s3Regex =
  /^https:\/\/[a-z0-9.-]+\.s3\.[a-z0-9-]+\.amazonaws\.com\/.+$/;
export const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

export const baseUrl = {
  v1: '/api/v1',
};
export const otpPageTokenExpireIn = '1d';
export const userLocationCacheExpireIn = '1d';
export const userAccessTokenExpiresIn = '30d';
export const adminAccessTokenExpiresIn = '15m';
export const refreshTokenExpiresInWithOutRememberMe = '3d';
export const refreshTokenExpiresInWithRememberMe = '30d';
export const otpExpireAt = 4;
export const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_RADIUS_KM = 5;
export const EARTH_RADIUS_KM = 6371;
export const SUBSCRIPTION_FEATURE_CACHE_EXPIRY = '1d';

/**
 * ==============================================
 * ------------------REDIS KEYS------------------
 * ==============================================
 */

/**
 * ⚠️ DEVELOPER NOTICE: REDIS KEY PREFIXES
 *
 * Rules for adding new prefixes:
 * 1. DO NOT include a trailing colon (:) at the end of the string.
 * 2. The `createRedisKey` utility automatically manages colon separators.
 *
 * Adding a trailing colon here will cause broken keys like 'user:otp::12345'.
 */
export const REDIS_PREFIXES = {
  otp: 'user:otp',
  blacklist: 'blacklist:token',
} as const;

export const OTP_GENERATE_CONFIG = {
  digits: true,
  lowerCaseAlphabets: false,
  specialChars: false,
  upperCaseAlphabets: false,
} as const;

export enum AuthErrorType {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_BLACKLISTED = 'TOKEN_BLACKLISTED',
  USER_BLOCKED = 'USER_BLOCKED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  DUPLICATE_DATA = 'DUPLICATE_DATA',
  OTP_EXPIRED = 'OTP_EXPIRED',
  INVALID_OTP = 'INVALID_OTP',
  ACCESS_DENIED = 'ACCESS_DENIED',
}
