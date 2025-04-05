import swaggerJSDoc from 'swagger-jsdoc';
import { taskSchema } from '../schemas/task.schema';
import { taskPaths } from '../paths/tasks.paths';

// Basic information about our API
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TODO App API',
    version: '1.0.0',
    description: 'API documentation for the TODO App',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'API Support',
      email: 'support@todoapp.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Tasks',
      description: 'Task management endpoints',
    },
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: process.env.SESSION_KEY || 'session-token',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ...taskSchema,
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          code: {
            type: 'string',
            example: 'VALIDATION_ERROR',
          },
          message: {
            type: 'string',
            example: 'Validation Error',
          },
          details: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['Invalid task ID format'],
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation failed for the request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      NotFoundError: {
        description: 'The specified resource was not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...taskPaths,
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // No need for file paths since we're defining everything in code
  apis: [],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
