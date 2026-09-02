/**
 * Logger Condicional para Produção/Desenvolvimento
 * Remove logs em produção para melhor performance
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

const isDev = (): boolean => {
  try {
    return import.meta.env?.DEV === true;
  } catch {
    return false;
  }
};

class TacticalLogger {
  private formatMessage(level: LogLevel, module: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${module}]`;
  }

  log(module: string, ...args: any[]) {
    if (isDev()) {
      console.log(this.formatMessage('log', module), ...args);
    }
  }

  warn(module: string, ...args: any[]) {
    if (isDev()) {
      console.warn(this.formatMessage('warn', module), ...args);
    }
  }

  error(module: string, ...args: any[]) {
    console.error(this.formatMessage('error', module), ...args);
  }

  info(module: string, ...args: any[]) {
    if (isDev()) {
      console.info(this.formatMessage('info', module), ...args);
    }
  }

  debug(module: string, ...args: any[]) {
    if (isDev()) {
      console.debug(this.formatMessage('debug', module), ...args);
    }
  }

  time(label: string) {
    if (isDev()) console.time(label);
  }

  timeEnd(label: string) {
    if (isDev()) console.timeEnd(label);
  }

  group(label: string) {
    if (isDev()) console.group(label);
  }

  groupEnd() {
    if (isDev()) console.groupEnd();
  }
}

export const logger = new TacticalLogger();
export default logger;
