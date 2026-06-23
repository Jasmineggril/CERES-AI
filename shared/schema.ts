import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sensors = pgTable("sensors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("active"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  lastPing: timestamp("last_ping").defaultNow(),
});

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  sensorId: integer("sensor_id").notNull(),
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  sensorId: integer("sensor_id"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  temperature: real("temperature"),
  humidity: real("humidity"),
  windSpeed: real("wind_speed"),
  windDirection: text("wind_direction"),
  rainfall: real("rainfall"),
  pressure: real("pressure"),
  uvIndex: real("uv_index"),
  condition: text("condition"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  points: integer("points").default(0),
  level: integer("level").default(1),
  denunciasCount: integer("denuncias_count").default(0),
  achievement: text("achievement").default("iniciante"),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const denuncias = pgTable("denuncias", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  categoria: text("categoria").notNull(), // 'queimada', 'desmatamento', 'invasao', 'poluicao', 'outro'
  latitude: real("latitude"),
  longitude: real("longitude"),
  municipio: text("municipio"),
  status: text("status").default("pendente"), // 'pendente', 'verificado', 'resolvido'
  pontosAtribuidos: integer("pontos_atribuidos").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: text("badge_id").notNull(),
  badgeName: text("badge_name").notNull(),
  badgeDesc: text("badge_desc").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, role: true });
export const insertSensorSchema = createInsertSchema(sensors).omit({ id: true, lastPing: true });
export const insertReadingSchema = createInsertSchema(readings).omit({ id: true, timestamp: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true, isResolved: true });
export const insertWeatherSchema = createInsertSchema(weatherData).omit({ id: true, timestamp: true });
export const insertUserStatsSchema = createInsertSchema(userStats).omit({ id: true, lastActivity: true });
export const insertDenunciaSchema = createInsertSchema(denuncias).omit({ id: true, createdAt: true, status: true, pontosAtribuidos: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, earnedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Sensor = typeof sensors.$inferSelect;
export type InsertSensor = z.infer<typeof insertSensorSchema>;
export type Reading = typeof readings.$inferSelect;
export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type Denuncia = typeof denuncias.$inferSelect;
export type InsertDenuncia = z.infer<typeof insertDenunciaSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
