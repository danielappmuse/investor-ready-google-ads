import React, { useState, useEffect } from 'react';
import { errorLogger, ErrorLog } from '@/utils/errorLogger';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bug, 
  Download, 
  Trash2, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const DebugLogPanel: React.FC = () => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refreshLogs = () => {
    setLogs(errorLogger.getLogs());
  };

  useEffect(() => {
    refreshLogs();
    
    if (autoRefresh) {
      const interval = setInterval(refreshLogs, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleClearLogs = () => {
    errorLogger.clearLogs();
    refreshLogs();
  };

  const handleDownloadLogs = () => {
    try {
      const logsBlob = errorLogger.exportLogs();
      const url = URL.createObjectURL(logsBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checkout-debug-logs-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      errorLogger.info('Debug logs downloaded from panel');
    } catch (error) {
      errorLogger.error('Failed to download logs from panel', error);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'debug': return <Zap className="h-4 w-4 text-gray-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      case 'info': return 'default';
      case 'debug': return 'outline';
      default: return 'default';
    }
  };

  const errorCount = logs.filter(log => log.level === 'error').length;
  const warnCount = logs.filter(log => log.level === 'warn').length;
  const isIPhone15ProMax = logs.some(log => log.deviceInfo?.isIPhone15ProMax);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between bg-background border-2 shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span>Debug Logs</span>
              {errorCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {errorCount}
                </Badge>
              )}
              {isIPhone15ProMax && (
                <Badge variant="secondary" className="text-xs">
                  iPhone 15 Pro Max
                </Badge>
              )}
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2">
          <Card className="p-4 space-y-4 bg-background border-2 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {logs.length} logs
                </span>
                {errorCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {errorCount} errors
                  </Badge>
                )}
                {warnCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {warnCount} warnings
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  title={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"}
                >
                  <RefreshCw className={`h-3 w-3 ${autoRefresh ? 'animate-spin' : ''}`} />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDownloadLogs}>
                  <Download className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleClearLogs}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-4">
                No logs yet
              </div>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {logs.slice(-20).reverse().map((log, index) => (
                    <div 
                      key={index}
                      className="text-xs border rounded p-2 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getLevelIcon(log.level)}
                          <Badge variant={getLevelColor(log.level) as any} className="text-xs">
                            {log.level}
                          </Badge>
                          {log.deviceInfo?.isIPhone15ProMax && (
                            <Badge variant="outline" className="text-xs">
                              iPhone 15 Pro Max
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="font-mono">
                        {log.message}
                      </div>
                      
                      {log.details && (
                        <details className="text-muted-foreground">
                          <summary className="cursor-pointer hover:text-foreground">
                            Details
                          </summary>
                          <pre className="mt-1 text-xs overflow-auto max-h-20 whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};