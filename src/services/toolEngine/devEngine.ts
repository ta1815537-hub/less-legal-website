/**
 * LESS CREATION — Production-Grade Developer Engine
 * 
 * - Real JSON Formatter & Validator with exact line/column error detection
 * - Unicode-safe Base64 encoder/decoder (TextEncoder / TextDecoder)
 * - Cryptographically secure password generator with Shannon entropy measurement
 */

export interface JsonValidationResult {
  valid: boolean;
  formatted?: string;
  minified?: string;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
}

export interface PasswordOptions {
  length: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeAmbiguous?: boolean; // exclude 1, l, I, 0, O
}

export interface PasswordResult {
  password: string;
  entropyBits: number;
  strengthLabel: 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
}

/**
 * Validates, formats, and minifies JSON with exact error positioning
 */
export function processJson(input: string, indentSpaces: number = 2): JsonValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: 'JSON input is empty.' };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const formatted = JSON.stringify(parsed, null, indentSpaces);
    const minified = JSON.stringify(parsed);
    return {
      valid: true,
      formatted,
      minified
    };
  } catch (err: unknown) {
    let message = err instanceof Error ? err.message : String(err);
    let errorLine: number | undefined;
    let errorColumn: number | undefined;

    // Extract position if present in standard format: "at position X"
    const posMatch = message.match(/at position (\d+)/i);
    if (posMatch) {
      const charIndex = parseInt(posMatch[1], 10);
      const lines = trimmed.slice(0, charIndex).split('\n');
      errorLine = lines.length;
      errorColumn = lines[lines.length - 1].length + 1;
      message = `${message} (Line ${errorLine}, Column ${errorColumn})`;
    }

    return {
      valid: false,
      error: message,
      errorLine,
      errorColumn
    };
  }
}

/**
 * Unicode-safe Base64 Encoding using TextEncoder
 */
export function encodeUnicodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Unicode-safe Base64 Decoding using TextDecoder
 */
export function decodeUnicodeBase64(base64: string): string {
  const binary = atob(base64.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Cryptographically secure random password generator
 */
export function generateSecurePassword(options: PasswordOptions): PasswordResult {
  const length = Math.max(6, Math.min(128, options.length || 16));

  let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  let numberChars = '0123456789';
  let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.excludeAmbiguous) {
    uppercaseChars = uppercaseChars.replace(/[IO]/g, '');
    lowercaseChars = lowercaseChars.replace(/[lo]/g, '');
    numberChars = numberChars.replace(/[01]/g, '');
  }

  let pool = '';
  const requiredChars: string[] = [];

  if (options.includeUppercase !== false) {
    pool += uppercaseChars;
    requiredChars.push(getRandomChar(uppercaseChars));
  }
  if (options.includeLowercase !== false) {
    pool += lowercaseChars;
    requiredChars.push(getRandomChar(lowercaseChars));
  }
  if (options.includeNumbers !== false) {
    pool += numberChars;
    requiredChars.push(getRandomChar(numberChars));
  }
  if (options.includeSymbols !== false) {
    pool += symbolChars;
    requiredChars.push(getRandomChar(symbolChars));
  }

  if (!pool) {
    pool = lowercaseChars + numberChars;
  }

  // Fill remaining characters
  const passwordChars = [...requiredChars];
  const remainingLength = length - passwordChars.length;

  for (let i = 0; i < remainingLength; i++) {
    passwordChars.push(getRandomChar(pool));
  }

  // Cryptographic Fisher-Yates shuffle
  const shuffled = secureShuffle(passwordChars).join('');

  // Shannon Entropy calculation: E = length * log2(poolSize)
  const poolSize = pool.length;
  const entropyBits = Math.round(length * Math.log2(poolSize));

  let strengthLabel: 'Weak' | 'Fair' | 'Strong' | 'Very Strong' = 'Weak';
  if (entropyBits >= 80) strengthLabel = 'Very Strong';
  else if (entropyBits >= 60) strengthLabel = 'Strong';
  else if (entropyBits >= 40) strengthLabel = 'Fair';

  return {
    password: shuffled,
    entropyBits,
    strengthLabel
  };
}

function getRandomChar(pool: string): string {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  const index = randomBuffer[0] % pool.length;
  return pool[index];
}

function secureShuffle(array: string[]): string[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const j = randomBuffer[0] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
