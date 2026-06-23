const PROMPT_INJECTION_PATTERNS = [
  { pattern: /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|directives|commands|messages|context|prompts?)/gi, replacement: '[redacted]' },
  { pattern: /system\s+prompt/gi, replacement: '[redacted]' },
  { pattern: /you\s+are\s+(now|not\s+(required|allowed|supposed)\s+to)/gi, replacement: '[redacted]' },
  { pattern: /forget\s+(all\s+)?(previous|prior|above|earlier)/gi, replacement: '[redacted]' },
  { pattern: /new\s+(instructions|directives|commands|rules?)/gi, replacement: '[redacted]' },
  { pattern: /override\s+(instructions|directives|commands|rules?|system)/gi, replacement: '[redacted]' },
  { pattern: /disregard\s+(all\s+)?(previous|prior|above|earlier)/gi, replacement: '[redacted]' },
  { pattern: /you\s+(must|will|have\s+to)\s+(now|forget|ignore)/gi, replacement: '[redacted]' },
  { pattern: /\[system\]|\[instructions\]|\[new\s+command\]/gi, replacement: '[redacted]' },
  { pattern: /do\s+not\s+follow\s+(the\s+)?(above|previous|these)\s+(instructions|rules)/gi, replacement: '[redacted]' },
];

const HARMFUL_CONTENT_PATTERNS = [
  { pattern: /how\s+to\s+(harm|hurt|kill|attack|assault|abuse)/i, category: 'violence' },
  { pattern: /instructions?\s+for\s+(making|creating|building|producing|manufacturing)\s+(a\s+)?(weapon|bomb|explosive|drug|narcotic|poison)/i, category: 'dangerous_goods' },
  { pattern: /(hack|crack|bypass|circumvent)\s+(into\s+)?(a\s+)?(system|account|password|security|login)/i, category: 'hacking' },
  { pattern: /phishing|malware|ransomware|trojan/i, category: 'malware' },
  { pattern: /suicide|self[\s-]harm|self[\s-]injury/i, category: 'self_harm' },
  { pattern: /child\s+(abuse|exploitation|pornography)/i, category: 'child_safety' },
];

const MAX_INPUT_LENGTH = 2000;
const MAX_OUTPUT_LENGTH = 10000;

export function sanitizeInput(input: string): string {
  let sanitized = input.trim();

  if (sanitized.length > MAX_INPUT_LENGTH) {
    sanitized = sanitized.slice(0, MAX_INPUT_LENGTH);
  }

  for (const { pattern, replacement } of PROMPT_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

  return sanitized;
}

export function sanitizeContextValue(value: unknown, depth = 0): unknown {
  if (depth > 5) return '[max depth]';
  if (typeof value === 'string') {
    let s = value;
    if (s.length > 500) s = s.slice(0, 500);
    for (const { pattern, replacement } of PROMPT_INJECTION_PATTERNS) {
      s = s.replace(pattern, replacement);
    }
    return s;
  }
  if (Array.isArray(value)) {
    return value.map(v => sanitizeContextValue(v, depth + 1));
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = sanitizeContextValue(v, depth + 1);
    }
    return result;
  }
  return value;
}

export function filterAIOutput(output: string): { safe: boolean; sanitized: string } {
  if (output.length > MAX_OUTPUT_LENGTH) {
    output = output.slice(0, MAX_OUTPUT_LENGTH);
  }

  for (const { pattern } of HARMFUL_CONTENT_PATTERNS) {
    if (pattern.test(output)) {
      return {
        safe: false,
        sanitized: "I'm unable to provide that information. Let's focus on reducing your carbon footprint! 🌱 Ask me about energy savings, sustainable travel, or eco-friendly tips.",
      };
    }
  }

  return { safe: true, sanitized: output };
}
