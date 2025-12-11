import winston from 'winston';

// Safe stringify (no circular crash)
function safeStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return String(obj); // fallback
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length ? safeStringify(meta) : '';
      return `${timestamp} [${level}]: ${message} ${metaStr}`;
    })
  ),
  transports: [new winston.transports.Console()]
});

// Store original error method
const originalError = logger.error.bind(logger);

// Override .error() to prevent Axios circular objects from breaking logger
logger.error = function (...args) {
  const cleaned = args.map(a => {
    if (a instanceof Error) {
      return {
        message: a.message,
        stack: a.stack,
        name: a.name,
        toJSON: () => ({
          message: a.message,
          name: a.name,
          stack: a.stack
        })
      };
    }

    // Axios error fix
    if (a?.config && a?.request) {
      return {
        message: a.message,
        code: a.code,
        url: a.config?.url,
        method: a.config?.method,
        requestData: a.config?.data || null,
        responseStatus: a.response?.status,
        responseData: a.response?.data,
      };
    }

    return a;
  });

  // Use the bound original method instead of prototype.apply
  originalError(...cleaned);
};

export default logger;