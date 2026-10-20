import { ENV } from '../utils/envHelpers';

export interface UserCredentials {
  username: string;
  password: string;
}

export type UserType = 'standard' | 'lockedOut' | 'problem';

const users: Record<UserType, UserCredentials> = {
  standard: {
    username: ENV.STANDARD_USER_NAME,
    password: ENV.STANDARD_USER_PASSWORD,
  },
  lockedOut: {
    username: ENV.LOCKED_USER_NAME,
    password: ENV.LOCKED_USER_PASSWORD,
  },
  problem: {
    username: ENV.PROBLEM_USER_NAME,
    password: ENV.PROBLEM_USER_PASSWORD,
  },
};

/**
 * Returns credentials by role name without exposing .env keys in tests.
 * Throws early if the .env values were missing.
 */
export function getUser(type: UserType): UserCredentials {
  const user = users[type];
  if (!user || !user.username || !user.password) {
    throw new Error(
      `Missing credentials for user type "${type}". Check your .env file keys.`
    );
  }
  return user;
}