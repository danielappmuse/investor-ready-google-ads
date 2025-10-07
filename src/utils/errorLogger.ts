// Error logging utility for checkout page debugging
export interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  details?: any;
  userAgent: string;
  url: string;
  deviceInfo: {
    isIPhone: boolean;
    isIPhone15ProMax: boolean;
    isSafari: boolean;
    isChrome: boolean;
    touchSupport: boolean;
    screenSize: string;
    viewport: string;
  };
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 500;

  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const isIPhone = /iPhone/.test(userAgent);
    const isIPhone15ProMax = isIPhone && (
      /iPhone16,1/.test(userAgent) || // iPhone 15 Pro Max model identifier
      (window.screen.height === 2796 && window.screen.width === 1290) // iPhone 15 Pro Max screen resolution
    );
    
    return {
      isIPhone,
      isIPhone15ProMax,
      isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      isChrome: /Chrome/.test(userAgent),
      touchSupport: 'ontouchstart' in window,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };
  }

  log(level: ErrorLog['level'], message: string, details?: any) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      deviceInfo: this.getDeviceInfo()
    };

    this.logs.push(errorLog);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console log for immediate debugging
    const logMethod = level === 'error' ? console.error : 
                     level === 'warn' ? console.warn : 
                     level === 'info' ? console.info : console.log;
    
    logMethod(`[${level.toUpperCase()}] ${message}`, details || '');

    // Store in localStorage for persistence
    try {
      localStorage.setItem('checkout-error-logs', JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to store logs in localStorage:', e);
    }
  }

  error(message: string, details?: any) {
    this.log('error', message, details);
  }

  warn(message: string, details?: any) {
    this.log('warn', message, details);
  }

  info(message: string, details?: any) {
    this.log('info', message, details);
  }

  debug(message: string, details?: any) {
    this.log('debug', message, details);
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  getLogsAsString(): string {
    return this.logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${log.details ? ' - ' + JSON.stringify(log.details) : ''}`
    ).join('\n');
  }

  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('checkout-error-logs');
    } catch (e) {
      console.warn('Failed to clear logs from localStorage:', e);
    }
  }

  // Load logs from localStorage on initialization
  loadStoredLogs() {
    try {
      const storedLogs = localStorage.getItem('checkout-error-logs');
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (e) {
      console.warn('Failed to load logs from localStorage:', e);
    }
  }

  // Export logs for sharing/debugging
  exportLogs(): Blob {
    const logData = {
      exportTime: new Date().toISOString(),
      deviceInfo: this.getDeviceInfo(),
      logs: this.logs
    };
    
    return new Blob([JSON.stringify(logData, null, 2)], { 
      type: 'application/json' 
    });
  }

  // iPhone 15 Pro Max specific logging
  logIPhone15ProMaxIssue(context: string, details?: any) {
    if (this.getDeviceInfo().isIPhone15ProMax) {
      this.error(`iPhone 15 Pro Max Issue - ${context}`, {
        ...details,
        specialNote: 'This is an iPhone 15 Pro Max specific issue',
        userAgent: navigator.userAgent,
        screen: { width: window.screen.width, height: window.screen.height },
        viewport: { width: window.innerWidth, height: window.innerHeight }
      });
    }
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger();

// Initialize on load
errorLogger.loadStoredLogs();

// Catch unhandled errors
window.addEventListener('error', (event) => {
  errorLogger.error('Unhandled JavaScript Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack
  });
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  errorLogger.error('Unhandled Promise Rejection', {
    reason: event.reason,
    promise: event.promise
  });
});

// Log initial device info
errorLogger.info('Error Logger Initialized', {
  deviceInfo: errorLogger['getDeviceInfo'](),
  timestamp: new Date().toISOString()
});
