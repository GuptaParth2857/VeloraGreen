import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://veloragreen.com'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('2.0.0'),
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_CHAT: z.coerce.boolean().default(true),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

function validateEnv() {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
      DATABASE_URL: process.env.DATABASE_URL,
      NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
      NEXT_PUBLIC_ENABLE_CHAT: process.env.NEXT_PUBLIC_ENABLE_CHAT,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = (error.issues || []).map((e) => `${String(e.path?.join?.('.') ?? '')}: ${e.message}`);
      console.warn('[Env Validation]', messages.join(', '));
    }
    return envSchema.parse({});
  }
}

export const env = validateEnv();
