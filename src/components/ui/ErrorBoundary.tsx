import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-madura-border shadow-elevated space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                Nyo'on Sapora (Mohon Maaf)
              </span>
              <h2 className="font-serif text-2xl font-bold text-navy">
                Terjadi Kendala pada Halaman
              </h2>
              <p className="text-xs text-madura-muted leading-relaxed">
                Aplikasi mengalami kendala teknis saat memuat tampilan ini. Silakan muat ulang atau kembali ke halaman beranda.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-left text-[11px] font-mono text-stone-600 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={this.handleReset}>
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span>Muat Ulang</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => (window.location.href = '/')}
              >
                <Home className="w-3.5 h-3.5 mr-1.5" />
                <span>Ke Beranda</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
