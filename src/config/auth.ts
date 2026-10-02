/**
 * Author Mode Authentication Configuration
 * Only users authenticated with OWNER_EMAIL are granted author mode privileges.
 */

export const OWNER_EMAIL = "mosesmukangai75@gmail.com";

/**
 * Checks if the given email matches the designated site owner.
 */
export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === OWNER_EMAIL.trim().toLowerCase();
}
