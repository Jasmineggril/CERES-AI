import { z } from 'zod';
import { insertSensorSchema, insertReadingSchema, insertAlertSchema, sensors, readings, alerts } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  sensors: {
    list: {
      method: 'GET' as const,
      path: '/api/sensors',
      responses: { 200: z.array(z.custom<typeof sensors.$inferSelect>()) },
    },
    get: {
      method: 'GET' as const,
      path: '/api/sensors/:id',
      responses: {
        200: z.custom<typeof sensors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/sensors',
      input: insertSensorSchema,
      responses: {
        201: z.custom<typeof sensors.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/sensors/:id',
      input: insertSensorSchema.partial(),
      responses: {
        200: z.custom<typeof sensors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sensors/:id',
      responses: { 204: z.void() },
    },
  },
  readings: {
    list: {
      method: 'GET' as const,
      path: '/api/readings',
      input: z.object({ sensorId: z.string().optional() }).optional(),
      responses: { 200: z.array(z.custom<typeof readings.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/readings',
      input: insertReadingSchema,
      responses: { 201: z.custom<typeof readings.$inferSelect>() },
    },
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts',
      responses: { 200: z.array(z.custom<typeof alerts.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/alerts',
      input: insertAlertSchema,
      responses: { 201: z.custom<typeof alerts.$inferSelect>() },
    },
    resolve: {
      method: 'PATCH' as const,
      path: '/api/alerts/:id/resolve',
      responses: { 200: z.custom<typeof alerts.$inferSelect>() },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
