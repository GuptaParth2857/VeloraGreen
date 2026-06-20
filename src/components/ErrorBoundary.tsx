'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold mb-2">Section Error</h3>
            <p className="text-sm text-white/60 mb-4">
              {this.state.error?.message || 'Something went wrong in this section.'}
            </p>
            <GlassButton onClick={this.handleReset} size="sm">
              <RefreshCw className="w-4 h-4" />
              Retry
            </GlassButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
