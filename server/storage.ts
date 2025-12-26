import { db } from "./db";
import {
  users, sensors, readings, alerts, weatherData, userStats,
  type InsertSensor, type InsertReading, type InsertAlert, type InsertWeatherData, type InsertUser, type InsertUserStats,
  type Sensor, type Reading, type Alert, type WeatherData, type User, type UserStats
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Sensors
  getSensors(): Promise<Sensor[]>;
  getSensor(id: number): Promise<Sensor | undefined>;
  createSensor(sensor: InsertSensor): Promise<Sensor>;
  updateSensor(id: number, updates: Partial<InsertSensor>): Promise<Sensor | undefined>;
  deleteSensor(id: number): Promise<void>;

  // Readings
  getReadings(sensorId?: number): Promise<Reading[]>;
  createReading(reading: InsertReading): Promise<Reading>;

  // Alerts
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<Alert | undefined>;

  // Weather Data
  getWeatherData(latitude?: number, longitude?: number): Promise<WeatherData[]>;
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getLatestWeather(): Promise<WeatherData | undefined>;

  // Gamification
  getUserStats(userId: number): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  addPoints(userId: number, points: number): Promise<UserStats | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Sensors
  async getSensors(): Promise<Sensor[]> {
    return await db.select().from(sensors).orderBy(sensors.id);
  }

  async getSensor(id: number): Promise<Sensor | undefined> {
    const [sensor] = await db.select().from(sensors).where(eq(sensors.id, id));
    return sensor;
  }

  async createSensor(sensor: InsertSensor): Promise<Sensor> {
    const [newSensor] = await db.insert(sensors).values(sensor).returning();
    return newSensor;
  }

  async updateSensor(id: number, updates: Partial<InsertSensor>): Promise<Sensor | undefined> {
    const [updated] = await db.update(sensors)
      .set(updates)
      .where(eq(sensors.id, id))
      .returning();
    return updated;
  }

  async deleteSensor(id: number): Promise<void> {
    await db.delete(sensors).where(eq(sensors.id, id));
  }

  // Readings
  async getReadings(sensorId?: number): Promise<Reading[]> {
    if (sensorId) {
      return await db.select().from(readings)
        .where(eq(readings.sensorId, sensorId))
        .orderBy(desc(readings.timestamp));
    }
    return await db.select().from(readings).orderBy(desc(readings.timestamp));
  }

  async createReading(reading: InsertReading): Promise<Reading> {
    const [newReading] = await db.insert(readings).values(reading).returning();
    return newReading;
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    const [updated] = await db.update(alerts)
      .set({ isResolved: true })
      .where(eq(alerts.id, id))
      .returning();
    return updated;
  }

  // Weather Data
  async getWeatherData(latitude?: number, longitude?: number): Promise<WeatherData[]> {
    const query = db.select().from(weatherData);
    return await query.orderBy(desc(weatherData.timestamp));
  }

  async createWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    const [newWeather] = await db.insert(weatherData).values(data).returning();
    return newWeather;
  }

  async getLatestWeather(): Promise<WeatherData | undefined> {
    const [latest] = await db.select().from(weatherData)
      .orderBy(desc(weatherData.timestamp))
      .limit(1);
    return latest;
  }

  // Gamification
  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }

  async createUserStats(stats: InsertUserStats): Promise<UserStats> {
    const [newStats] = await db.insert(userStats).values(stats).returning();
    return newStats;
  }

  async addPoints(userId: number, points: number): Promise<UserStats | undefined> {
    const current = await this.getUserStats(userId);
    if (!current) return undefined;
    
    const currentPoints = current.points ?? 0;
    const newPoints = currentPoints + points;
    const newLevel = Math.floor(newPoints / 100) + 1;
    let achievement = "iniciante";
    if (newPoints >= 500) achievement = "herói";
    else if (newPoints >= 300) achievement = "guardião";
    else if (newPoints >= 100) achievement = "protetor";

    const [updated] = await db.update(userStats)
      .set({ points: newPoints, level: newLevel, achievement, lastActivity: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
