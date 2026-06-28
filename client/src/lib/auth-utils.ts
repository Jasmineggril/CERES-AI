export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isPasswordStrong(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
}
