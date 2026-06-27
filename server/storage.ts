import { db } from "./db";
import {
  users, sensors, readings, alerts, weatherData, userStats, denuncias, achievements,
  type InsertSensor, type InsertReading, type InsertAlert, type InsertWeatherData, type InsertUser, type InsertUserStats,
  type Sensor, type Reading, type Alert, type WeatherData, type User, type UserStats,
  type InsertDenuncia, type Denuncia, type InsertAchievement, type Achievement
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(userId: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getSensors(): Promise<Sensor[]>;
  getSensor(id: number): Promise<Sensor | undefined>;
  createSensor(sensor: InsertSensor): Promise<Sensor>;
  updateSensor(id: number, updates: Partial<InsertSensor>): Promise<Sensor | undefined>;
  deleteSensor(id: number): Promise<void>;
  getReadings(sensorId?: number): Promise<Reading[]>;
  createReading(reading: InsertReading): Promise<Reading>;
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<Alert | undefined>;
  getWeatherData(latitude?: number, longitude?: number): Promise<WeatherData[]>;
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getLatestWeather(): Promise<WeatherData | undefined>;
  getUserStats(userId: number): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  addPoints(userId: number, points: number): Promise<UserStats | undefined>;
  incrementDenuncias(userId: number): Promise<UserStats | undefined>;
  getDenuncias(userId?: number): Promise<Denuncia[]>;
  createDenuncia(data: InsertDenuncia): Promise<Denuncia>;
  getAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(data: InsertAchievement): Promise<Achievement>;
}

export class DatabaseStorage implements IStorage {
  private useFallback = false;
  private fallbackUsers: User[] = [];
  private fallbackSensors: Sensor[] = [];
  private fallbackReadings: Reading[] = [];
  private fallbackAlerts: Alert[] = [];
  private fallbackWeather: WeatherData[] = [];
  private fallbackUserStats: UserStats[] = [];
  private fallbackDenuncias: Denuncia[] = [];
  private fallbackAchievements: Achievement[] = [];

  private logFallback(reason: unknown) {
    this.useFallback = true;
    console.warn("Falling back to in-memory storage:", reason instanceof Error ? reason.message : String(reason));
  }

  private nextId<T extends { id: number }>(items: T[]) {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  private async withFallback<T>(operation: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.useFallback) {
      return fallback();
    }

    try {
      return await operation();
    } catch (error) {
      this.logFallback(error);
      return fallback();
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.withFallback(
      async () => {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
      },
      () => this.fallbackUsers.find((user) => user.email === email),
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.withFallback(
      async () => {
        const [newUser] = await db.insert(users).values(user).returning();
        return newUser;
      },
      () => {
        const created: User = {
          id: this.nextId(this.fallbackUsers),
          email: user.email,
          password: user.password,
          name: user.name,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          role: user.role ?? "user",
          bio: user.bio ?? "",
          avatar: user.avatar ?? "",
          createdAt: new Date(),
        };
        this.fallbackUsers.push(created);
        return created;
      },
    );
  }

  async getUserById(userId: number): Promise<User | undefined> {
    return this.withFallback(
      async () => {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        return user;
      },
      () => this.fallbackUsers.find((user) => user.id === userId),
    );
  }

  async updateUser(userId: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    return this.withFallback(
      async () => {
        const updateObject = Object.fromEntries(
          Object.entries(updates).filter(([, value]) => value !== undefined),
        );

        if (Object.keys(updateObject).length === 0) {
          const [user] = await db.select().from(users).where(eq(users.id, userId));
          return user;
        }

        const [updated] = await db.update(users).set(updateObject).where(eq(users.id, userId)).returning();
        return updated;
      },
      () => {
        const index = this.fallbackUsers.findIndex((user) => user.id === userId);
        if (index === -1) return undefined;

        const updated = {
          ...this.fallbackUsers[index],
          ...updates,
        } as User;
        this.fallbackUsers[index] = updated;
        return updated;
      },
    );
  }

  get isFallbackActive() {
    return this.useFallback;
  }

  async getSensors(): Promise<Sensor[]> {
    return this.withFallback(
      async () => await db.select().from(sensors).orderBy(sensors.id),
      () => [...this.fallbackSensors].sort((a, b) => a.id - b.id),
    );
  }

  async getSensor(id: number): Promise<Sensor | undefined> {
    return this.withFallback(
      async () => {
        const [sensor] = await db.select().from(sensors).where(eq(sensors.id, id));
        return sensor;
      },
      () => this.fallbackSensors.find((sensor) => sensor.id === id),
    );
  }

  async createSensor(sensor: InsertSensor): Promise<Sensor> {
    return this.withFallback(
      async () => {
        const [newSensor] = await db.insert(sensors).values(sensor).returning();
        return newSensor;
      },
      () => {
        const created: Sensor = {
          id: this.nextId(this.fallbackSensors),
          name: sensor.name,
          type: sensor.type,
          location: sensor.location,
          status: sensor.status,
          latitude: sensor.latitude ?? null,
          longitude: sensor.longitude ?? null,
          lastPing: new Date(),
        };
        this.fallbackSensors.push(created);
        return created;
      },
    );
  }

  async updateSensor(id: number, updates: Partial<InsertSensor>): Promise<Sensor | undefined> {
    return this.withFallback(
      async () => {
        const [updated] = await db.update(sensors).set(updates).where(eq(sensors.id, id)).returning();
        return updated;
      },
      () => {
        const index = this.fallbackSensors.findIndex((sensor) => sensor.id === id);
        if (index === -1) return undefined;
        const updated = { ...this.fallbackSensors[index], ...updates } as Sensor;
        this.fallbackSensors[index] = updated;
        return updated;
      },
    );
  }

  async deleteSensor(id: number): Promise<void> {
    return this.withFallback(
      async () => {
        await db.delete(sensors).where(eq(sensors.id, id));
      },
      () => {
        this.fallbackSensors = this.fallbackSensors.filter((sensor) => sensor.id !== id);
      },
    );
  }

  async getReadings(sensorId?: number): Promise<Reading[]> {
    return this.withFallback(
      async () => {
        if (sensorId) {
          return await db.select().from(readings).where(eq(readings.sensorId, sensorId)).orderBy(desc(readings.timestamp));
        }
        return await db.select().from(readings).orderBy(desc(readings.timestamp));
      },
      () => this.fallbackReadings.filter((reading) => !sensorId || reading.sensorId === sensorId).sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0)),
    );
  }

  async createReading(reading: InsertReading): Promise<Reading> {
    return this.withFallback(
      async () => {
        const [newReading] = await db.insert(readings).values(reading).returning();
        return newReading;
      },
      () => {
        const created: Reading = {
          id: this.nextId(this.fallbackReadings),
          sensorId: reading.sensorId,
          value: reading.value,
          unit: reading.unit,
          timestamp: new Date(),
        };
        this.fallbackReadings.push(created);
        return created;
      },
    );
  }

  async getAlerts(): Promise<Alert[]> {
    return this.withFallback(
      async () => await db.select().from(alerts).orderBy(desc(alerts.createdAt)),
      () => [...this.fallbackAlerts].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)),
    );
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    return this.withFallback(
      async () => {
        const [newAlert] = await db.insert(alerts).values(alert).returning();
        return newAlert;
      },
      () => {
        const created: Alert = {
          id: this.nextId(this.fallbackAlerts),
          sensorId: alert.sensorId ?? null,
          title: alert.title,
          message: alert.message,
          severity: alert.severity,
          isResolved: alert.isResolved ?? false,
          createdAt: new Date(),
        };
        this.fallbackAlerts.push(created);
        return created;
      },
    );
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    return this.withFallback(
      async () => {
        const [updated] = await db.update(alerts).set({ isResolved: true }).where(eq(alerts.id, id)).returning();
        return updated;
      },
      () => {
        const index = this.fallbackAlerts.findIndex((alert) => alert.id === id);
        if (index === -1) return undefined;
        const updated = { ...this.fallbackAlerts[index], isResolved: true } as Alert;
        this.fallbackAlerts[index] = updated;
        return updated;
      },
    );
  }

  async getWeatherData(latitude?: number, longitude?: number): Promise<WeatherData[]> {
    return this.withFallback(
      async () => await db.select().from(weatherData).orderBy(desc(weatherData.timestamp)),
      () => [...this.fallbackWeather].sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0)),
    );
  }

  async createWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    return this.withFallback(
      async () => {
        const [newWeather] = await db.insert(weatherData).values(data).returning();
        return newWeather;
      },
      () => {
        const created: WeatherData = {
          id: this.nextId(this.fallbackWeather),
          latitude: data.latitude,
          longitude: data.longitude,
          temperature: data.temperature ?? null,
          humidity: data.humidity ?? null,
          windSpeed: data.windSpeed ?? null,
          windDirection: data.windDirection ?? null,
          rainfall: data.rainfall ?? null,
          pressure: data.pressure ?? null,
          uvIndex: data.uvIndex ?? null,
          condition: data.condition ?? null,
          timestamp: new Date(),
        };
        this.fallbackWeather.push(created);
        return created;
      },
    );
  }

  async getLatestWeather(): Promise<WeatherData | undefined> {
    return this.withFallback(
      async () => {
        const [latest] = await db.select().from(weatherData).orderBy(desc(weatherData.timestamp)).limit(1);
        return latest;
      },
      () => this.fallbackWeather.slice().sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0))[0],
    );
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return this.withFallback(
      async () => {
        const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
        return stats;
      },
      () => this.fallbackUserStats.find((stats) => stats.userId === userId),
    );
  }

  async createUserStats(stats: InsertUserStats): Promise<UserStats> {
    return this.withFallback(
      async () => {
        const [newStats] = await db.insert(userStats).values(stats).returning();
        return newStats;
      },
      () => {
        const created: UserStats = {
          id: this.nextId(this.fallbackUserStats),
          userId: stats.userId,
          points: stats.points ?? 0,
          level: stats.level ?? 1,
          denunciasCount: stats.denunciasCount ?? 0,
          achievement: stats.achievement ?? "iniciante",
          lastActivity: new Date(),
        };
        this.fallbackUserStats.push(created);
        return created;
      },
    );
  }

  async addPoints(userId: number, points: number): Promise<UserStats | undefined> {
    return this.withFallback(
      async () => {
        const current = await this.getUserStats(userId);
        if (!current) return undefined;
        const currentPoints = current.points ?? 0;
        const newPoints = currentPoints + points;
        const newLevel = newPoints >= 1000 ? 5 : newPoints >= 500 ? 4 : newPoints >= 300 ? 3 : newPoints >= 100 ? 2 : 1;
        let achievement = "iniciante";
        if (newPoints >= 1000) achievement = "mestre";
        else if (newPoints >= 500) achievement = "herói";
        else if (newPoints >= 300) achievement = "guardião";
        else if (newPoints >= 100) achievement = "protetor";
        const [updated] = await db.update(userStats).set({ points: newPoints, level: newLevel, achievement, lastActivity: new Date() }).where(eq(userStats.userId, userId)).returning();
        return updated;
      },
      () => {
        const index = this.fallbackUserStats.findIndex((stats) => stats.userId === userId);
        if (index === -1) return undefined;
        const current = this.fallbackUserStats[index];
        const newPoints = (current.points ?? 0) + points;
        const newLevel = newPoints >= 1000 ? 5 : newPoints >= 500 ? 4 : newPoints >= 300 ? 3 : newPoints >= 100 ? 2 : 1;
        let achievement = "iniciante";
        if (newPoints >= 1000) achievement = "mestre";
        else if (newPoints >= 500) achievement = "herói";
        else if (newPoints >= 300) achievement = "guardião";
        else if (newPoints >= 100) achievement = "protetor";
        const updated = { ...current, points: newPoints, level: newLevel, achievement, lastActivity: new Date() } as UserStats;
        this.fallbackUserStats[index] = updated;
        return updated;
      },
    );
  }

  async incrementDenuncias(userId: number): Promise<UserStats | undefined> {
    return this.withFallback(
      async () => {
        const current = await this.getUserStats(userId);
        if (!current) return undefined;
        const [updated] = await db.update(userStats).set({ denunciasCount: (current.denunciasCount ?? 0) + 1, lastActivity: new Date() }).where(eq(userStats.userId, userId)).returning();
        return updated;
      },
      () => {
        const index = this.fallbackUserStats.findIndex((stats) => stats.userId === userId);
        if (index === -1) return undefined;
        const updated = { ...this.fallbackUserStats[index], denunciasCount: (this.fallbackUserStats[index].denunciasCount ?? 0) + 1, lastActivity: new Date() } as UserStats;
        this.fallbackUserStats[index] = updated;
        return updated;
      },
    );
  }

  async getDenuncias(userId?: number): Promise<Denuncia[]> {
    return this.withFallback(
      async () => {
        if (userId) {
          return await db.select().from(denuncias).where(eq(denuncias.userId, userId)).orderBy(desc(denuncias.createdAt));
        }
        return await db.select().from(denuncias).orderBy(desc(denuncias.createdAt));
      },
      () => this.fallbackDenuncias.filter((denuncia) => !userId || denuncia.userId === userId).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)),
    );
  }

  async createDenuncia(data: InsertDenuncia): Promise<Denuncia> {
    return this.withFallback(
      async () => {
        const [d] = await db.insert(denuncias).values(data).returning();
        return d;
      },
      () => {
        const created: Denuncia = {
          id: this.nextId(this.fallbackDenuncias),
          userId: data.userId ?? null,
          titulo: data.titulo,
          descricao: data.descricao,
          categoria: data.categoria,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          municipio: data.municipio ?? null,
          status: "pendente",
          pontosAtribuidos: 50,
          createdAt: new Date(),
        };
        this.fallbackDenuncias.push(created);
        return created;
      },
    );
  }

  async getAchievements(userId: number): Promise<Achievement[]> {
    return this.withFallback(
      async () => await db.select().from(achievements).where(eq(achievements.userId, userId)).orderBy(desc(achievements.earnedAt)),
      () => this.fallbackAchievements.filter((achievement) => achievement.userId === userId).sort((a, b) => (b.earnedAt?.getTime() ?? 0) - (a.earnedAt?.getTime() ?? 0)),
    );
  }

  async createAchievement(data: InsertAchievement): Promise<Achievement> {
    return this.withFallback(
      async () => {
        const [a] = await db.insert(achievements).values(data).returning();
        return a;
      },
      () => {
        const created: Achievement = {
          id: this.nextId(this.fallbackAchievements),
          userId: data.userId,
          badgeId: data.badgeId,
          badgeName: data.badgeName,
          badgeDesc: data.badgeDesc,
          earnedAt: new Date(),
        };
        this.fallbackAchievements.push(created);
        return created;
      },
    );
  }
}

export const storage = new DatabaseStorage();
