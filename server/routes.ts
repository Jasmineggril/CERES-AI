import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { fetchWeatherData, assessFireRisk } from "./weather-service";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Sensors
  app.get(api.sensors.list.path, async (req, res) => {
    const sensors = await storage.getSensors();
    res.json(sensors);
  });

  app.get(api.sensors.get.path, async (req, res) => {
    const sensor = await storage.getSensor(Number(req.params.id));
    if (!sensor) return res.status(404).json({ message: "Sensor not found" });
    res.json(sensor);
  });

  app.post(api.sensors.create.path, async (req, res) => {
    try {
      const input = api.sensors.create.input.parse(req.body);
      const sensor = await storage.createSensor(input);
      res.status(201).json(sensor);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.sensors.update.path, async (req, res) => {
    try {
      const input = api.sensors.update.input.parse(req.body);
      const sensor = await storage.updateSensor(Number(req.params.id), input);
      if (!sensor) return res.status(404).json({ message: "Sensor not found" });
      res.json(sensor);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.sensors.delete.path, async (req, res) => {
    await storage.deleteSensor(Number(req.params.id));
    res.status(204).send();
  });

  // Readings
  app.get(api.readings.list.path, async (req, res) => {
    const sensorId = req.query.sensorId ? Number(req.query.sensorId) : undefined;
    const readings = await storage.getReadings(sensorId);
    res.json(readings);
  });

  app.post(api.readings.create.path, async (req, res) => {
    try {
      const input = api.readings.create.input.parse(req.body);
      const reading = await storage.createReading(input);
      res.status(201).json(reading);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Alerts
  app.get(api.alerts.list.path, async (req, res) => {
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });

  app.post(api.alerts.create.path, async (req, res) => {
    try {
      const input = api.alerts.create.input.parse(req.body);
      const alert = await storage.createAlert(input);
      res.status(201).json(alert);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.alerts.resolve.path, async (req, res) => {
    const alert = await storage.resolveAlert(Number(req.params.id));
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  });

  // Weather
  app.post(api.weather.fetch.path, async (req, res) => {
    try {
      const input = api.weather.fetch.input.parse(req.body);
      const weatherData = await fetchWeatherData(input.latitude, input.longitude);
      
      if (!weatherData) {
        return res.status(400).json({ message: "Falha ao buscar dados de previsão" });
      }

      // Assess fire risk
      const { riskLevel, factors } = assessFireRisk(weatherData);
      
      // Store in database
      const stored = await storage.createWeatherData(weatherData);
      
      // Create alert if risk is high
      if (riskLevel === "critical" || riskLevel === "high") {
        await storage.createAlert({
          title: `Risco de Fogo ${riskLevel.toUpperCase()}`,
          message: `Condições meteorológicas desfavoráveis: ${factors.join(", ")}`,
          severity: riskLevel === "critical" ? "critical" : "medium"
        });
      }

      res.status(201).json(stored);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.weather.latest.path, async (req, res) => {
    const latest = await storage.getLatestWeather();
    res.json(latest || null);
  });

  await seedDatabase();

  return httpServer;
}

export async function seedDatabase() {
  const sensors = await storage.getSensors();
  if (sensors.length === 0) {
    console.log("Seeding database...");
    const s1 = await storage.createSensor({
      name: "Alpha Station",
      type: "Environmental",
      location: "North Sector",
      latitude: -3.4653,
      longitude: -62.2159,
      status: "active"
    });
    const s2 = await storage.createSensor({
      name: "Beta Station",
      type: "Fire Detection",
      location: "East Sector",
      latitude: -3.4680,
      longitude: -62.2100,
      status: "active"
    });

    // Readings
    await storage.createReading({ sensorId: s1.id, value: 24.5, unit: "°C" });
    await storage.createReading({ sensorId: s1.id, value: 25.1, unit: "°C" });
    await storage.createReading({ sensorId: s1.id, value: 60, unit: "%" }); // Humidity

    // Alerts
    await storage.createAlert({
      sensorId: s2.id,
      title: "High Temperature Warning",
      message: "Temperature exceeded threshold in East Sector.",
      severity: "medium"
    });
    console.log("Database seeded!");
  }
}
