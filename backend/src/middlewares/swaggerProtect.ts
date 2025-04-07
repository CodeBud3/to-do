import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to protect Swagger documentation in production
 * Uses basic authentication with configurable credentials
 */
export const swaggerProtect = (req: Request, res: Response, next: NextFunction): void => {
  // Skip protection in development environment
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Get credentials from environment variables or use defaults
  const username = process.env.SWAGGER_USERNAME || 'admin';
  const password = process.env.SWAGGER_PASSWORD || 'todoapp'; // Should be set in production

  // Check for authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    // Prompt for credentials if no auth header or wrong format
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).send('Authentication required to access API documentation');
    return;
  }

  // Extract and validate credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [providedUsername, providedPassword] = credentials.split(':');

  if (providedUsername !== username || providedPassword !== password) {
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).send('Invalid credentials');
    return;
  }

  // Credentials valid, proceed
  next();
};
