import { z } from 'zod';
import { insertUserSchema, insertSensorSchema, insertReadingSchema, insertAlertSchema, insertWeatherSchema, users, sensors, readings, alerts, weatherData } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ email: z.string(), password: z.string() }),
      responses: { 200: z.object({ id: z.number(), email: z.string(), name: z.string() }) },
    },
    signup: {
      method: 'POST' as const,
      path: '/api/auth/signup',
      input: insertUserSchema,
      responses: { 201: z.custom<typeof users.$inferSelect>() },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: { 200: z.void() },
    },
    status: {
      method: 'GET' as const,
      path: '/api/auth/status',
      responses: { 200: z.object({ userId: z.number(), email: z.string(), name: z.string() }) },
    },
  },
  user: {
    profile: {
      get: {
        method: 'GET' as const,
        path: '/api/user/profile',
        responses: {
          200: z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            role: z.string(),
            bio: z.string(),
            avatar: z.string(),
            usingFallback: z.boolean(),
          }),
        },
      },
      update: {
        method: 'PUT' as const,
        path: '/api/user/profile',
        input: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          role: z.string().optional(),
          bio: z.string().optional(),
          avatar: z.string().optional(),
        }),
        responses: {
          200: z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            role: z.string(),
            bio: z.string(),
            avatar: z.string(),
            usingFallback: z.boolean(),
          }),
        },
      },
    },
  },
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
  },
  weather: {
    fetch: {
      method: 'POST' as const,
      path: '/api/weather/fetch',
      input: z.object({ latitude: z.number(), longitude: z.number() }),
      responses: { 201: z.custom<typeof weatherData.$inferSelect>() },
    },
    latest: {
      method: 'GET' as const,
      path: '/api/weather/latest',
      responses: { 200: z.custom<typeof weatherData.$inferSelect>().nullable() },
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
