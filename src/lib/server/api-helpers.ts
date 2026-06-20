import { NextResponse } from 'next/server';

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function withErrorHandler(handler: () => Promise<NextResponse>) {
  return async () => {
    try {
      return await handler();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      console.error('[API Error]', error);
      return NextResponse.json(
        { success: false, error: message },
        { status: 500 }
      );
    }
  };
}
