import { db } from "./db";
import {
  sensors, readings, alerts, weatherData,
  type InsertSensor, type InsertReading, type InsertAlert, type InsertWeatherData,
  type Sensor, type Reading, type Alert, type WeatherData
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
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
}

export class DatabaseStorage implements IStorage {
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
    let query = db.select().from(weatherData);
    
    if (latitude !== undefined && longitude !== undefined) {
      // Find weather data near coordinates (within ~1 degree)
      query = query.where(
        (sq) => sq
      );
    }
    
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
}

export const storage = new DatabaseStorage();
