export const taskPaths = {
  '/tasks': {
    get: {
      tags: ['Tasks'],
      summary: 'Get all tasks',
      description: 'Retrieve all tasks for the authenticated user with optional filtering',
      security: [{ cookieAuth: [] }, { bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
            enum: ['todo', 'in-progress', 'done']
          },
          description: 'Filter tasks by status'
        },
        {
          in: 'query',
          name: 'priority',
          schema: {
            type: 'string',
            enum: ['high', 'medium', 'low']
          },
          description: 'Filter tasks by priority'
        },
        {
          in: 'query',
          name: 'matrix',
          schema: {
            type: 'string',
            enum: ['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important']
          },
          description: 'Filter tasks by Eisenhower matrix category'
        },
        {
          in: 'query',
          name: 'tag',
          schema: {
            type: 'string',
            enum: ['work', 'personal', 'errand', 'other']
          },
          description: 'Filter tasks by tag'
        },
        {
          in: 'query',
          name: 'startDate',
          schema: {
            type: 'string',
            format: 'date-time'
          },
          description: 'Filter tasks with due date on or after this date'
        },
        {
          in: 'query',
          name: 'endDate',
          schema: {
            type: 'string',
            format: 'date-time'
          },
          description: 'Filter tasks with due date on or before this date'
        },
        {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            default: 1
          },
          description: 'Page number for pagination'
        },
        {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            default: 10
          },
          description: 'Number of items per page'
        },
        {
          in: 'query',
          name: 'sortBy',
          schema: {
            type: 'string',
            default: 'sequence_num'
          },
          description: 'Field to sort by'
        },
        {
          in: 'query',
          name: 'sortOrder',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'asc'
          },
          description: 'Sort order'
        }
      ],
      responses: {
        '200': {
          description: 'A list of tasks',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TasksResponse'
              }
            }
          }
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        }
      }
    },
    post: {
      tags: ['Tasks'],
      summary: 'Create a new task',
      description: 'Create a new task for the authenticated user',
      security: [{ cookieAuth: [] }, { bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateTaskRequest'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Task created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        }
      }
    }
  },
  '/tasks/{id}': {
    get: {
      tags: ['Tasks'],
      summary: 'Get a task by ID',
      description: 'Retrieve a specific task by its ID',
      security: [{ cookieAuth: [] }, { bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Task ID'
        }
      ],
      responses: {
        '200': {
          description: 'Task found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    },
    put: {
      tags: ['Tasks'],
      summary: 'Update a task',
      description: 'Update an existing task by its ID',
      security: [{ cookieAuth: [] }, { bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Task ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateTaskRequest'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Task updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    },
    delete: {
      tags: ['Tasks'],
      summary: 'Delete a task',
      description: 'Delete a task by its ID',
      security: [{ cookieAuth: [] }, { bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Task ID'
        }
      ],
      responses: {
        '200': {
          description: 'Task deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: 'Task deleted successfully'
                  }
                }
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    }
  },
  '/tasks/reorder': {
    patch: {
      tags: ['Tasks'],
      summary: 'Reorder tasks',
      description: 'Update the sequence numbers of multiple tasks at once',
      security: [{ cookieAuth: [] }, { bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ReorderTasksRequest'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Tasks reordered successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: 'Tasks reordered successfully'
                  },
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Task'
                    }
                  }
                }
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    }
  }
};
