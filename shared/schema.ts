import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sensors = pgTable("sensors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // e.g., 'Temperature', 'Humidity', 'CO2', 'Camera'
  location: text("location").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'inactive', 'maintenance'
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
  severity: text("severity").notNull(), // 'low', 'medium', 'critical'
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
  condition: text("condition"), // 'sunny', 'cloudy', 'rainy', 'storm'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertSensorSchema = createInsertSchema(sensors).omit({ id: true, lastPing: true });
export const insertReadingSchema = createInsertSchema(readings).omit({ id: true, timestamp: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true, isResolved: true });
export const insertWeatherSchema = createInsertSchema(weatherData).omit({ id: true, timestamp: true });

export type Sensor = typeof sensors.$inferSelect;
export type InsertSensor = z.infer<typeof insertSensorSchema>;
export type Reading = typeof readings.$inferSelect;
export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherSchema>;
