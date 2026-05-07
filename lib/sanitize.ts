const REDACTIONS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /\b5WU\d{5}\b/g, replacement: "[redacted-account]" },
  { pattern: /\b178\.156\.231\.86\b/g, replacement: "[redacted-host]" },
  { pattern: /\bsk-ant-(api|admin)\d{2}-[\w-]{20,}/gi, replacement: "[redacted-key]" },
  { pattern: /\/root\/vcp-scanner\b/g, replacement: "[redacted-path]" },
  { pattern: /\bapple\b/gi, replacement: "[employer]" },
];

export function sanitize(text: string): string {
  let out = text;
  for (const { pattern, replacement } of REDACTIONS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function containsDenied(text: string): boolean {
  for (const { pattern } of REDACTIONS) {
    pattern.lastIndex = 0; // reset stateful global regex
    if (pattern.test(text)) return true;
  }
  return false;
}
