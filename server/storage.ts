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

interface FallbackState {
  users: User[];
  sensors: Sensor[];
  readings: Reading[];
  alerts: Alert[];
  weatherData: WeatherData[];
  userStats: UserStats[];
  denuncias: Denuncia[];
  achievements: Achievement[];
}

const fallbackState: FallbackState = {
  users: [],
  sensors: [],
  readings: [],
  alerts: [],
  weatherData: [],
  userStats: [],
  denuncias: [],
  achievements: [],
};

function isDatabaseError(error: unknown) {
  return error instanceof Error && /ECONNREFUSED|timeout|database|relation|does not exist|connect/i.test(error.message);
}

function createUserRecord(input: InsertUser): User {
  return {
    id: fallbackState.users.length + 1,
    email: input.email,
    password: input.password,
    name: input.name,
    firstName: input.firstName ?? "",
    lastName: input.lastName ?? "",
    role: "user",
    bio: input.bio ?? "",
    avatar: input.avatar ?? "",
    createdAt: new Date(),
  };
}

export class DatabaseStorage implements IStorage {
  private useFallback = false;

  private logFallback(reason: unknown) {
    this.useFallback = true;
    console.warn("Falling back to in-memory storage:", reason instanceof Error ? reason.message : String(reason));
  }

  private async runWithFallback<T>(operation: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.useFallback) {
      return fallback();
    }

    try {
      return await operation();
    } catch (error) {
      if (isDatabaseError(error)) {
        this.logFallback(error);
        return fallback();
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.runWithFallback(
      async () => {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
      },
      () => fallbackState.users.find((user) => user.email === email)
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.runWithFallback(
      async () => {
        const [newUser] = await db.insert(users).values(user).returning();
        return newUser;
      },
      () => {
        const newUser = createUserRecord(user);
        fallbackState.users.push(newUser);
        return newUser;
      }
    );
  }

  async getUserById(userId: number): Promise<User | undefined> {
    return this.runWithFallback(
      async () => {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        return user;
      },
      () => fallbackState.users.find((user) => user.id === userId)
    );
  }

  async updateUser(userId: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    return this.runWithFallback(
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
        const index = fallbackState.users.findIndex((user) => user.id === userId);
        if (index === -1) return undefined;

        const updated = {
          ...fallbackState.users[index],
          ...updates,
        } as User;
        fallbackState.users[index] = updated;
        return updated;
      }
    );
  }

  isFallbackActive(): boolean {
    return this.useFallback;
  }

  async getSensors(): Promise<Sensor[]> {
    return this.runWithFallback(
      async () => await db.select().from(sensors).orderBy(sensors.id),
      () => [...fallbackState.sensors].sort((a, b) => a.id - b.id)
    );
  }

  async getSensor(id: number): Promise<Sensor | undefined> {
    return this.runWithFallback(
      async () => {
        const [sensor] = await db.select().from(sensors).where(eq(sensors.id, id));
        return sensor;
      },
      () => fallbackState.sensors.find((sensor) => sensor.id === id)
    );
  }

  async createSensor(sensor: InsertSensor): Promise<Sensor> {
    return this.runWithFallback(
      async () => {
        const [newSensor] = await db.insert(sensors).values(sensor).returning();
        return newSensor;
      },
      () => {
        const newSensor: Sensor = {
          id: fallbackState.sensors.length + 1,
          name: sensor.name,
          type: sensor.type,
          location: sensor.location,
          status: sensor.status ?? "active",
          latitude: sensor.latitude ?? null,
          longitude: sensor.longitude ?? null,
          lastPing: new Date(),
        };
        fallbackState.sensors.push(newSensor);
        return newSensor;
      }
    );
  }

  async updateSensor(id: number, updates: Partial<InsertSensor>): Promise<Sensor | undefined> {
    return this.runWithFallback(
      async () => {
        const [updated] = await db.update(sensors)
          .set(updates)
          .where(eq(sensors.id, id))
          .returning();
        return updated;
      },
      () => {
        const sensor = fallbackState.sensors.find((item) => item.id === id);
        if (!sensor) return undefined;
        Object.assign(sensor, updates);
        return sensor;
      }
    );
  }

  async deleteSensor(id: number): Promise<void> {
    return this.runWithFallback(
      async () => {
        await db.delete(sensors).where(eq(sensors.id, id));
      },
      () => {
        fallbackState.sensors = fallbackState.sensors.filter((sensor) => sensor.id !== id);
      }
    );
  }

  async getReadings(sensorId?: number): Promise<Reading[]> {
    return this.runWithFallback(
      async () => {
        if (sensorId) {
          return await db.select().from(readings)
            .where(eq(readings.sensorId, sensorId))
            .orderBy(desc(readings.timestamp));
        }
        return await db.select().from(readings).orderBy(desc(readings.timestamp));
      },
      () => fallbackState.readings.filter((reading) => !sensorId || reading.sensorId === sensorId)
    );
  }

  async createReading(reading: InsertReading): Promise<Reading> {
    return this.runWithFallback(
      async () => {
        const [newReading] = await db.insert(readings).values(reading).returning();
        return newReading;
      },
      () => {
        const newReading: Reading = {
          id: fallbackState.readings.length + 1,
          sensorId: reading.sensorId,
          value: reading.value,
          unit: reading.unit,
          timestamp: new Date(),
        };
        fallbackState.readings.push(newReading);
        return newReading;
      }
    );
  }

  async getAlerts(): Promise<Alert[]> {
    return this.runWithFallback(
      async () => await db.select().from(alerts).orderBy(desc(alerts.createdAt)),
      () => [...fallbackState.alerts].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
    );
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    return this.runWithFallback(
      async () => {
        const [newAlert] = await db.insert(alerts).values(alert).returning();
        return newAlert;
      },
      () => {
        const newAlert: Alert = {
          id: fallbackState.alerts.length + 1,
          sensorId: alert.sensorId ?? null,
          title: alert.title,
          message: alert.message,
          severity: alert.severity,
          isResolved: false,
          createdAt: new Date(),
        };
        fallbackState.alerts.push(newAlert);
        return newAlert;
      }
    );
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    return this.runWithFallback(
      async () => {
        const [updated] = await db.update(alerts)
          .set({ isResolved: true })
          .where(eq(alerts.id, id))
          .returning();
        return updated;
      },
      () => {
        const alert = fallbackState.alerts.find((item) => item.id === id);
        if (!alert) return undefined;
        alert.isResolved = true;
        return alert;
      }
    );
  }

  async getWeatherData(latitude?: number, longitude?: number): Promise<WeatherData[]> {
    return this.runWithFallback(
      async () => {
        const query = db.select().from(weatherData);
        return await query.orderBy(desc(weatherData.timestamp));
      },
      () => fallbackState.weatherData.filter((item) => (latitude == null || item.latitude === latitude) && (longitude == null || item.longitude === longitude))
    );
  }

  async createWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    return this.runWithFallback(
      async () => {
        const [newWeather] = await db.insert(weatherData).values(data).returning();
        return newWeather;
      },
      () => {
        const newWeather: WeatherData = {
          id: fallbackState.weatherData.length + 1,
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
        fallbackState.weatherData.push(newWeather);
        return newWeather;
      }
    );
  }

  async getLatestWeather(): Promise<WeatherData | undefined> {
    return this.runWithFallback(
      async () => {
        const [latest] = await db.select().from(weatherData)
          .orderBy(desc(weatherData.timestamp))
          .limit(1);
        return latest;
      },
      () => fallbackState.weatherData[0]
    );
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return this.runWithFallback(
      async () => {
        const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
        return stats;
      },
      () => fallbackState.userStats.find((stats) => stats.userId === userId)
    );
  }

  async createUserStats(stats: InsertUserStats): Promise<UserStats> {
    return this.runWithFallback(
      async () => {
        const [newStats] = await db.insert(userStats).values(stats).returning();
        return newStats;
      },
      () => {
        const newStats: UserStats = {
          id: fallbackState.userStats.length + 1,
          userId: stats.userId,
          points: stats.points ?? 0,
          level: stats.level ?? 1,
          denunciasCount: stats.denunciasCount ?? 0,
          achievement: stats.achievement ?? "iniciante",
          lastActivity: new Date(),
        };
        fallbackState.userStats.push(newStats);
        return newStats;
      }
    );
  }

  async addPoints(userId: number, points: number): Promise<UserStats | undefined> {
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

    return this.runWithFallback(
      async () => {
        const [updated] = await db.update(userStats)
          .set({ points: newPoints, level: newLevel, achievement, lastActivity: new Date() })
          .where(eq(userStats.userId, userId))
          .returning();
        return updated;
      },
      () => {
        const update = fallbackState.userStats.find((item) => item.userId === userId);
        if (!update) return undefined;
        update.points = newPoints;
        update.level = newLevel;
        update.achievement = achievement;
        update.lastActivity = new Date();
        return update;
      }
    );
  }

  async incrementDenuncias(userId: number): Promise<UserStats | undefined> {
    const current = await this.getUserStats(userId);
    if (!current) return undefined;
    return this.runWithFallback(
      async () => {
        const [updated] = await db.update(userStats)
          .set({ denunciasCount: (current.denunciasCount ?? 0) + 1, lastActivity: new Date() })
          .where(eq(userStats.userId, userId))
          .returning();
        return updated;
      },
      () => {
        const update = fallbackState.userStats.find((item) => item.userId === userId);
        if (!update) return undefined;
        update.denunciasCount = (update.denunciasCount ?? 0) + 1;
        update.lastActivity = new Date();
        return update;
      }
    );
  }

  async getDenuncias(userId?: number): Promise<Denuncia[]> {
    return this.runWithFallback(
      async () => {
        if (userId) {
          return await db.select().from(denuncias)
            .where(eq(denuncias.userId, userId))
            .orderBy(desc(denuncias.createdAt));
        }
        return await db.select().from(denuncias).orderBy(desc(denuncias.createdAt));
      },
      () => fallbackState.denuncias.filter((item) => !userId || item.userId === userId)
    );
  }

  async createDenuncia(data: InsertDenuncia): Promise<Denuncia> {
    return this.runWithFallback(
      async () => {
        const [d] = await db.insert(denuncias).values(data).returning();
        return d;
      },
      () => {
        const newDenuncia: Denuncia = {
          id: fallbackState.denuncias.length + 1,
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
        fallbackState.denuncias.push(newDenuncia);
        return newDenuncia;
      }
    );
  }

  async getAchievements(userId: number): Promise<Achievement[]> {
    return this.runWithFallback(
      async () => await db.select().from(achievements)
        .where(eq(achievements.userId, userId))
        .orderBy(desc(achievements.earnedAt)),
      () => fallbackState.achievements.filter((item) => item.userId === userId)
    );
  }

  async createAchievement(data: InsertAchievement): Promise<Achievement> {
    return this.runWithFallback(
      async () => {
        const [a] = await db.insert(achievements).values(data).returning();
        return a;
      },
      () => {
        const newAchievement: Achievement = {
          id: fallbackState.achievements.length + 1,
          userId: data.userId,
          badgeId: data.badgeId,
          badgeName: data.badgeName,
          badgeDesc: data.badgeDesc,
          earnedAt: new Date(),
        };
        fallbackState.achievements.push(newAchievement);
        return newAchievement;
      }
    );
  }
}

export const storage = new DatabaseStorage();
