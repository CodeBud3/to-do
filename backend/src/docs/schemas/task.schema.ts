export const taskSchema = {
  Task: {
    type: 'object',
    required: ['title', 'user_id'],
    properties: {
      _id: {
        type: 'string',
        description: 'The auto-generated id of the task',
        example: '60d21b4667d0d8992e610c85'
      },
      title: {
        type: 'string',
        description: 'The title of the task',
        example: 'Complete project documentation'
      },
      description: {
        type: 'string',
        description: 'The detailed description of the task',
        example: 'Write up all technical specifications and API documentation'
      },
      priority: {
        type: 'string',
        enum: ['high', 'medium', 'low'],
        description: 'The priority level of the task',
        example: 'high'
      },
      matrix: {
        type: 'string',
        enum: ['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important'],
        description: 'The Eisenhower matrix category of the task',
        example: 'urgent-important'
      },
      status: {
        type: 'string',
        enum: ['todo', 'in-progress', 'done'],
        description: 'The current status of the task',
        example: 'todo'
      },
      due_date: {
        type: 'string',
        format: 'date-time',
        description: 'The due date of the task',
        example: '2025-04-15T23:59:59.999Z'
      },
      stack_rank: {
        type: 'number',
        description: 'The stack rank of the task (used for prioritization)',
        example: 2
      },
      user_id: {
        type: 'string',
        description: 'The ID of the user who owns the task',
        example: '60d21b4667d0d8992e610c85'
      },
      tag: {
        type: 'string',
        enum: ['work', 'personal', 'errand', 'other'],
        description: 'The tag category for the task',
        example: 'work'
      },
      sequence_num: {
        type: 'number',
        description: 'The sequence number of the task (used for ordering)',
        example: 1
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'The timestamp when the task was created',
        example: '2025-04-01T10:30:00.000Z'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'The timestamp when the task was last updated',
        example: '2025-04-02T14:45:00.000Z'
      }
    }
  },
  CreateTaskRequest: {
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        example: 'Complete project documentation'
      },
      description: {
        type: 'string',
        example: 'Write up all technical specifications and API documentation'
      },
      priority: {
        type: 'string',
        enum: ['high', 'medium', 'low'],
        example: 'high'
      },
      matrix: {
        type: 'string',
        enum: ['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important'],
        example: 'urgent-important'
      },
      status: {
        type: 'string',
        enum: ['todo', 'in-progress', 'done'],
        example: 'todo'
      },
      due_date: {
        type: 'string',
        format: 'date-time',
        example: '2025-04-15T23:59:59.999Z'
      },
      stack_rank: {
        type: 'number',
        example: 2
      },
      tag: {
        type: 'string',
        enum: ['work', 'personal', 'errand', 'other'],
        example: 'work'
      }
    }
  },
  UpdateTaskRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Updated project documentation'
      },
      description: {
        type: 'string',
        example: 'Updated technical specifications and API documentation'
      },
      priority: {
        type: 'string',
        enum: ['high', 'medium', 'low'],
        example: 'medium'
      },
      matrix: {
        type: 'string',
        enum: ['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important'],
        example: 'not-urgent-important'
      },
      status: {
        type: 'string',
        enum: ['todo', 'in-progress', 'done'],
        example: 'in-progress'
      },
      due_date: {
        type: 'string',
        format: 'date-time',
        example: '2025-04-20T23:59:59.999Z'
      },
      stack_rank: {
        type: 'number',
        example: 3
      },
      tag: {
        type: 'string',
        enum: ['work', 'personal', 'errand', 'other'],
        example: 'work'
      }
    }
  },
  ReorderTasksRequest: {
    type: 'object',
    required: ['tasks'],
    properties: {
      tasks: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'sequence_num'],
          properties: {
            id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            sequence_num: {
              type: 'number',
              example: 2
            }
          }
        },
        example: [
          { id: '60d21b4667d0d8992e610c85', sequence_num: 0 },
          { id: '60d21b4667d0d8992e610c86', sequence_num: 1 },
          { id: '60d21b4667d0d8992e610c87', sequence_num: 2 }
        ]
      }
    }
  },
  TaskResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Task retrieved successfully'
      },
      data: {
        $ref: '#/components/schemas/Task'
      }
    }
  },
  TasksResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Tasks retrieved successfully'
      },
      data: {
        type: 'object',
        properties: {
          tasks: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Task'
            }
          },
          pagination: {
            type: 'object',
            properties: {
              total: {
                type: 'number',
                example: 15
              },
              page: {
                type: 'number',
                example: 1
              },
              limit: {
                type: 'number',
                example: 10
              },
              totalPages: {
                type: 'number',
                example: 2
              }
            }
          }
        }
      }
    }
  }
};
