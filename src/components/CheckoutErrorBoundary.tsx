import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorLogger } from '@/utils/errorLogger';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Download } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class CheckoutErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    errorLogger.error('React Error Boundary Caught Error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      isCheckoutError: true
    });

    // Special logging for iPhone 15 Pro Max
    errorLogger.logIPhone15ProMaxIssue('React Error Boundary', {
      error: error.message,
      componentStack: errorInfo.componentStack
    });
  }

  handleReload = () => {
    errorLogger.info('User triggered page reload from error boundary');
    window.location.reload();
  };

  handleDownloadLogs = () => {
    try {
      const logsBlob = errorLogger.exportLogs();
      const url = URL.createObjectURL(logsBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checkout-error-logs-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      errorLogger.info('User downloaded error logs');
    } catch (error) {
      errorLogger.error('Failed to download logs', error);
    }
  };

  render() {
    if (this.state.hasError) {
      const isIPhone15ProMax = /iPhone16,1/.test(navigator.userAgent) || 
        (window.screen.height === 2796 && window.screen.width === 1290);

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">
                We've encountered an error while loading the checkout page.
              </p>
              
              {isIPhone15ProMax && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>iPhone 15 Pro Max Detected:</strong> This error has been specially logged for debugging.
                  </p>
                </div>
              )}
              
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  View Error Details
                </summary>
                <div className="mt-2 p-3 bg-muted rounded text-xs font-mono overflow-auto max-h-40">
                  <div><strong>Error:</strong> {this.state.error?.message}</div>
                  {this.state.error?.stack && (
                    <div className="mt-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={this.handleReload} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              <Button onClick={this.handleDownloadLogs} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Logs
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Error logged at {new Date().toLocaleString()}
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}