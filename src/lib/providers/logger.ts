// ============================================================================
// FILE: src/lib/logger.ts
// ============================================================================

/**
 * 📝 Next.js Global Logger (Fixed - No Performance Issues)
 * ✅ Works in Server Components
 * ✅ Works in Client Components
 * ✅ Works in API Routes
 * ✅ Works in Middleware
 * ✅ No hanging or performance degradation
 */

type LogLevel = "debug" | "info" | "success" | "warn" | "error" | "fatal";
type Environment = "development" | "production" | "test";
type ExecutionContext = "server" | "client" | "static" | "middleware";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
  environment: Environment;
  executionContext: ExecutionContext;
  userId?: string;
  sessionId?: string;
  url?: string;
  filePath?: string;
}

interface LoggerConfig {
  environment: Environment;
  enableColors: boolean;
  showTimestamp: boolean;
  showContext: boolean;
  logToConsole: boolean;
  logToBackend: boolean;
  backendEndpoint?: string;
  maxDataDepth: number;
  sensitiveFields: string[];
  enablePerformanceLogging: boolean;
  // ✅ NEW: Batch logging settings
  batchSize: number;
  batchDelayMs: number;
}

class GlobalLogger {
  private static instance: GlobalLogger;
  private config: LoggerConfig;
  private sessionId: string;
  private userId?: string;
  private isBrowser: boolean;
  private isServer: boolean;
  private performanceMarks: Map<string, number>;
  // ✅ NEW: Batch logging queue
  private logQueue: LogEntry[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  // ✅ NEW: Prevent recursive logging
  private isLogging = false;

  private constructor() {
    this.isBrowser = typeof window !== "undefined";
    this.isServer = !this.isBrowser;
    this.sessionId = this.generateSessionId();
    this.performanceMarks = new Map();

    this.config = {
      environment: (process.env.NODE_ENV as Environment) || "development",
      enableColors: process.env.NODE_ENV !== "production",
      showTimestamp: true,
      showContext: true,
      logToConsole: true,
      logToBackend: process.env.NODE_ENV === "production",
      backendEndpoint: "/api/logs",
      maxDataDepth: 2, // ✅ REDUCED: From 3 to 2 (faster sanitization)
      sensitiveFields: [
        "password",
        "token",
        "secret",
        "apiKey",
        "authorization",
      ],
      enablePerformanceLogging: true,
      // ✅ NEW: Batch settings
      batchSize: 10,
      batchDelayMs: 2000,
    };

    this.initialize();
  }

  public static getInstance(): GlobalLogger {
    if (!GlobalLogger.instance) {
      GlobalLogger.instance = new GlobalLogger();
    }
    return GlobalLogger.instance;
  }

  private generateSessionId(): string {
    return (
      "session_" +
      Date.now() +
      "_" +
      Math.random().toString(36).substring(2, 9)
    );
  }

  private initialize(): void {
    // ✅ FIX: Don't log during initialization (prevents recursive loop)
    if (this.isBrowser) {
      this.setupErrorHandling();
    }
  }

  private setupErrorHandling(): void {
    if (!this.isBrowser) return;

    // ✅ FIX: Use non-blocking error handlers
    window.addEventListener("error", (event) => {
      // Only log actual errors, not network errors
      if (event.error instanceof Error) {
        this.logDirectly("error", "Uncaught Error", {
          message: event.error.message,
          stack: event.error.stack,
        });
      }
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.logDirectly("error", "Unhandled Promise Rejection", {
        reason: event.reason,
      });
    });
  }

  private getExecutionContext(): ExecutionContext {
    if (this.isServer) {
      return "server";
    }
    return "client";
  }

  private getCurrentFilePath(): string {
    if (this.isBrowser) {
      // ✅ FIX: Don't access window properties too often
      try {
        return window.location.pathname;
      } catch {
        return "unknown";
      }
    }

    // ✅ FIX: Server-side - faster implementation
    try {
      const stack = new Error().stack || "";
      const lines = stack.split("\n");

      for (let i = 2; i < Math.min(lines.length, 5); i++) {
        const line = lines[i];
        if (line && !line.includes("node_modules")) {
          const match = line.match(/\((.+?):\d+:\d+\)/);
          if (match) {
            return match[1].split("/").slice(-2).join("/");
          }
        }
      }
    } catch {
      // Silent fail
    }

    return "unknown";
  }

  private sanitizeData(data: any, depth: number = 0): any {
    // ✅ FIX: Faster depth check
    if (depth > this.config.maxDataDepth) {
      return "[Max depth]";
    }

    // ✅ FIX: Early returns for common types
    if (data === null || data === undefined) {
      return data;
    }

    const type = typeof data;

    if (type === "string") {
      // ✅ FIX: Faster string check
      const lowerData = data.toLowerCase();
      for (const field of this.config.sensitiveFields) {
        if (lowerData.includes(field)) {
          return "[REDACTED]";
        }
      }
      return data;
    }

    if (type === "number" || type === "boolean") {
      return data;
    }

    if (Array.isArray(data)) {
      // ✅ FIX: Limit array size
      return data.slice(0, 5).map((item) => this.sanitizeData(item, depth + 1));
    }

    if (type === "object") {
      const sanitized: any = {};
      let count = 0;
      for (const key in data) {
        // ✅ FIX: Limit object keys
        if (count > 10) break;

        const isSensitive = this.config.sensitiveFields.some((field) =>
          key.toLowerCase().includes(field.toLowerCase())
        );

        sanitized[key] = isSensitive
          ? "[REDACTED]"
          : this.sanitizeData(data[key], depth + 1);
        count++;
      }
      return sanitized;
    }

    return data;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    context?: string
  ): LogEntry {
    return {
      level,
      message,
      data: data ? this.sanitizeData(data) : undefined,
      timestamp: new Date().toISOString(),
      context,
      environment: this.config.environment,
      executionContext: this.getExecutionContext(),
      userId: this.userId,
      sessionId: this.sessionId,
      url: this.isBrowser ? window.location.pathname : undefined,
      filePath: this.getCurrentFilePath(),
    };
  }

  private getConsoleIcon(level: LogLevel): string {
    const icons: Record<LogLevel, string> = {
      debug: "🐛",
      info: "ℹ️",
      success: "✅",
      warn: "⚠️",
      error: "❌",
      fatal: "💀",
    };
    return icons[level];
  }

  // ✅ FIX: Direct logging without recursion
  private logDirectly(
    level: LogLevel,
    message: string,
    data?: any
  ): void {
    if (!this.config.logToConsole) return;

    const icon = this.getConsoleIcon(level);
    const prefix = `${icon} [${level.toUpperCase()}]`;

    switch (level) {
      case "debug":
        if (this.isDevelopment()) {
          console.debug(prefix, message, data);
        }
        break;
      case "info":
      case "success":
        console.log(prefix, message, data);
        break;
      case "warn":
        console.warn(prefix, message, data);
        break;
      case "error":
      case "fatal":
        console.error(prefix, message, data);
        break;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levelPriority: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      success: 1,
      warn: 2,
      error: 3,
      fatal: 4,
    };

    const envRules: Record<Environment, LogLevel[]> = {
      development: ["debug", "info", "success", "warn", "error", "fatal"],
      production: ["warn", "error", "fatal"],
      test: ["error", "fatal"],
    };

    return envRules[this.config.environment].includes(level);
  }

  // ✅ FIX: Non-blocking batch sending
  private async sendToBackend(entry: LogEntry): Promise<void> {
    if (!this.config.logToBackend || !this.config.backendEndpoint) return;

    this.logQueue.push(entry);

    // Send immediately if batch is full
    if (this.logQueue.length >= this.config.batchSize) {
      await this.flushLogs();
    } else if (!this.batchTimer) {
      // Schedule batch send
      this.batchTimer = setTimeout(() => this.flushLogs(), this.config.batchDelayMs);
    }
  }

  // ✅ FIX: Non-blocking batch flush
  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) return;

    const batch = this.logQueue.splice(0, this.config.batchSize);

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // ✅ FIX: Use non-blocking fetch
    try {
      // Use navigator.sendBeacon for better reliability
      if (this.isBrowser && navigator.sendBeacon) {
        navigator.sendBeacon(
          this.config.backendEndpoint!,
          JSON.stringify(batch)
        );
      } else {
        // Fallback to fetch with keepalive
        await fetch(this.config.backendEndpoint!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch),
          keepalive: true, // ✅ FIX: Keep connection alive
        }).catch(() => {
          // Silently fail - don't create infinite recursion
        });
      }
    } catch (error) {
      // Silent fail
    }
  }

  // ============ PUBLIC API ============

  public setUser(id: string, metadata?: any): void {
    this.userId = id;
    this.logDirectly("info", "User session started", { userId: id, ...metadata });
  }

  public clearUser(): void {
    this.userId = undefined;
    this.logDirectly("info", "User session ended");
  }

  public updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // ✅ FIX: Simplified logging without recursion
  public debug(message: string, data?: any, context?: string): void {
    if (!this.shouldLog("debug")) return;
    const entry = this.createLogEntry("debug", message, data, context);
    this.logDirectly("debug", message, data);
  }

  public info(message: string, data?: any, context?: string): void {
    if (!this.shouldLog("info")) return;
    const entry = this.createLogEntry("info", message, data, context);
    this.logDirectly("info", message, data);
    this.sendToBackend(entry);
  }

  public success(message: string, data?: any, context?: string): void {
    if (!this.shouldLog("success")) return;
    const entry = this.createLogEntry("success", message, data, context);
    this.logDirectly("success", message, data);
    this.sendToBackend(entry);
  }

  public warn(message: string, data?: any, context?: string): void {
    if (!this.shouldLog("warn")) return;
    const entry = this.createLogEntry("warn", message, data, context);
    this.logDirectly("warn", message, data);
    this.sendToBackend(entry);
  }

  public error(message: string, error?: Error, context?: string): void {
    const entry = this.createLogEntry("error", message, {
      error: error
        ? {
            name: error.name,
            message: error.message,
          }
        : undefined,
    }, context);

    this.logDirectly("error", message, error);
    this.sendToBackend(entry);
  }

  public fatal(message: string, error?: Error, context?: string): void {
    const entry = this.createLogEntry("fatal", message, {
      error: error
        ? {
            name: error.name,
            message: error.message,
          }
        : undefined,
    }, context);

    this.logDirectly("fatal", message, error);
    this.sendToBackend(entry);
  }

  // ============ PERFORMANCE LOGGING ============

  public mark(label: string): void {
    if (!this.config.enablePerformanceLogging) return;
    this.performanceMarks.set(label, performance.now());
  }

  public measure(label: string, startLabel?: string): void {
    if (!this.config.enablePerformanceLogging) return;

    const startTime = startLabel
      ? this.performanceMarks.get(startLabel)
      : this.performanceMarks.get(label);

    if (startTime) {
      const duration = performance.now() - startTime;
      this.logDirectly("info", `⏱️ ${label}: ${duration.toFixed(2)}ms`);
      this.performanceMarks.delete(label);
      if (startLabel) this.performanceMarks.delete(startLabel);
    }
  }

  // ============ NETWORK LOGGING ============

  public logRequest(
    url: string,
    method: string,
    status: number,
    duration: number
  ): void {
    const level = status >= 400 ? "error" : status >= 300 ? "warn" : "success";

    this.logDirectly(level, `${method} ${url}`, {
      status,
      duration: `${duration}ms`,
    });
  }

  // ============ HELPER METHODS ============

  public isDevelopment(): boolean {
    return this.config.environment === "development";
  }

  public isProduction(): boolean {
    return this.config.environment === "production";
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  public getExecutionInfo(): any {
    return {
      environment: this.config.environment,
      sessionId: this.sessionId,
      userId: this.userId,
      isBrowser: this.isBrowser,
      isServer: this.isServer,
    };
  }
}

// ============ SINGLETON INSTANCE ============
export const logger = GlobalLogger.getInstance();

// ============ CONVENIENCE EXPORTS ============
export const log = {
  debug: (message: string, data?: any, context?: string) =>
    logger.debug(message, data, context),

  info: (message: string, data?: any, context?: string) =>
    logger.info(message, data, context),

  success: (message: string, data?: any, context?: string) =>
    logger.success(message, data, context),

  warn: (message: string, data?: any, context?: string) =>
    logger.warn(message, data, context),

  error: (message: string, error?: Error, context?: string) =>
    logger.error(message, error, context),

  fatal: (message: string, error?: Error, context?: string) =>
    logger.fatal(message, error, context),

  mark: (label: string) => logger.mark(label),
  measure: (label: string, startLabel?: string) =>
    logger.measure(label, startLabel),

  api: (url: string, method: string, status: number, duration: number) =>
    logger.logRequest(url, method, status, duration),

  setUser: (id: string, metadata?: any) => logger.setUser(id, metadata),
  clearUser: () => logger.clearUser(),
  getInfo: () => logger.getExecutionInfo(),
  isDev: () => logger.isDevelopment(),
  isProd: () => logger.isProduction(),
};

export default logger;
export type { LogLevel, LogEntry, LoggerConfig };
