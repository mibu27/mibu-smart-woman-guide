import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: crypto.randomUUID()
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to localStorage for debugging
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        errorInfo,
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 10 error logs
      if (existingLogs.length > 10) {
        existingLogs.splice(0, existingLogs.length - 10);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(existingLogs));
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: ''
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert('Detail error telah disalin ke clipboard');
      })
      .catch(() => {
        alert('Gagal menyalin detail error');
      });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Ups! Terjadi Kesalahan
              </h2>
              <p className="mb-4 text-gray-600 text-sm">
                Aplikasi mengalami kesalahan yang tidak terduga. Tim kami akan segera memperbaikinya.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-left">
                  <p className="text-xs font-mono text-red-800 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  onClick={this.handleRetry} 
                  className="w-full bg-mibu-purple hover:bg-mibu-darkpurple"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Coba Lagi
                </Button>
                
                <Button 
                  onClick={this.handleReload} 
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Muat Ulang Halaman
                </Button>
                
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline"
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Button>

                {process.env.NODE_ENV === 'development' && (
                  <Button 
                    onClick={this.copyErrorDetails} 
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <Bug className="mr-2 h-3 w-3" />
                    Salin Detail Error (Dev)
                  </Button>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Error ID: {this.state.errorId.slice(0, 8)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
