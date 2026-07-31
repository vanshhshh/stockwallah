type LogMeta = Record<string, unknown>;

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(JSON.stringify({ level: "info", message, ...meta, ts: new Date().toISOString() }));
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(JSON.stringify({ level: "warn", message, ...meta, ts: new Date().toISOString() }));
  },
  error(message: string, meta?: LogMeta) {
    console.error(JSON.stringify({ level: "error", message, ...meta, ts: new Date().toISOString() }));
  },
};

