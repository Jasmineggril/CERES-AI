import { db } from "./db";
import {
  sensors, readings, alerts,
  type InsertSensor, type InsertReading, type InsertAlert,
  type Sensor, type Reading, type Alert
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
}

export const storage = new DatabaseStorage();
