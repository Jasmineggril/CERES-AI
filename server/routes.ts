import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import crypto from "crypto";
import { db } from "./db";
import { alerts } from "@shared/schema";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth
  app.post(api.auth.signup.path, async (req, res) => {
    try {
      const input = api.auth.signup.input.parse(req.body);
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const user = await storage.createUser({
        ...input,
        password: hashPassword(input.password),
      });

      (req as any).session = { userId: user.id, email: user.email, name: user.name };
      res.status(201).json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      
      if (!user || user.password !== hashPassword(input.password)) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      (req as any).session = { userId: user.id, email: user.email, name: user.name };
      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    (req as any).session = null;
    res.json({});
  });

  app.get("/api/auth/status", (req, res) => {
    if ((req as any).session) {
      res.json((req as any).session);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

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

  // Gamification — user stats
  app.get("/api/user-stats/me", async (req, res) => {
    const session = (req as any).session;
    if (!session) return res.status(401).json({ message: "Not authenticated" });
    let stats = await storage.getUserStats(session.userId);
    if (!stats) {
      stats = await storage.createUserStats({ userId: session.userId, points: 0, level: 1, denunciasCount: 0, achievement: "iniciante" });
    }
    res.json(stats);
  });

  app.get("/api/user-stats/:userId", async (req, res) => {
    const stats = await storage.getUserStats(Number(req.params.userId));
    if (!stats) return res.status(404).json({ message: "Stats not found" });
    res.json(stats);
  });

  app.post("/api/user-stats/:userId/add-points", async (req, res) => {
    const { points } = req.body;
    const updated = await storage.addPoints(Number(req.params.userId), points);
    res.json(updated || { error: "User not found" });
  });

  // Denúncias
  app.get("/api/denuncias", async (req, res) => {
    const items = await storage.getDenuncias();
    res.json(items);
  });

  app.post("/api/denuncias", async (req, res) => {
    try {
      const session = (req as any).session;
      const data = req.body;
      if (!data.titulo || !data.descricao || !data.categoria) {
        return res.status(400).json({ message: "Campos obrigatórios: titulo, descricao, categoria" });
      }
      const denuncia = await storage.createDenuncia({
        ...data,
        userId: session?.userId ?? null,
      });
      // Award points if authenticated
      if (session?.userId) {
        let stats = await storage.getUserStats(session.userId);
        if (!stats) {
          await storage.createUserStats({ userId: session.userId, points: 50, level: 1, denunciasCount: 1, achievement: "iniciante" });
        } else {
          await storage.addPoints(session.userId, 50);
          await storage.incrementDenuncias(session.userId);
        }
      }
      res.status(201).json(denuncia);
    } catch (err) {
      res.status(500).json({ message: "Erro ao criar denúncia" });
    }
  });

  await seedDatabase();

  return httpServer;
}

export async function seedDatabase() {
  const sensors = await storage.getSensors();
  if (sensors.length === 0) {
    console.log("Seeding database...");
    const s1 = await storage.createSensor({
      name: "Estação Alfa",
      type: "Ambiental",
      location: "Setor Norte – Chapada dos Veadeiros",
      latitude: -14.1414,
      longitude: -47.6792,
      status: "active"
    });
    const s2 = await storage.createSensor({
      name: "Estação Beta",
      type: "Detecção de Incêndio",
      location: "Setor Leste – Vale do Paranã",
      latitude: -13.9500,
      longitude: -47.2000,
      status: "active"
    });
    const s3 = await storage.createSensor({
      name: "Estação Gama",
      type: "Qualidade do Ar",
      location: "Setor Sul – Alto Paraíso",
      latitude: -14.1230,
      longitude: -47.5100,
      status: "active"
    });

    await storage.createReading({ sensorId: s1.id, value: 36.8, unit: "°C" });
    await storage.createReading({ sensorId: s1.id, value: 28, unit: "%" });
    await storage.createReading({ sensorId: s2.id, value: 42.1, unit: "°C" });
    await storage.createReading({ sensorId: s3.id, value: 185, unit: "AQI" });

    console.log("Database seeded!");
  }

  // Re-seed alerts in Portuguese if they are still in the old English format
  const existingAlerts = await storage.getAlerts();
  const hasEnglishAlerts = existingAlerts.some(a =>
    a.title.toLowerCase().includes("warning") ||
    a.title.toLowerCase().includes("temperature") ||
    a.title.toLowerCase().includes("high")
  );

  if (existingAlerts.length === 0 || hasEnglishAlerts) {
    // Clear old alerts and insert Portuguese ones
    await db.delete(alerts);

    const allSensors = await storage.getSensors();
    const s1id = allSensors[0]?.id ?? 1;
    const s2id = allSensors[1]?.id ?? 2;
    const s3id = allSensors[2]?.id ?? (allSensors[0]?.id ?? 1);

    await storage.createAlert({
      sensorId: s2id,
      title: "🔥 Foco de Incêndio Detectado",
      message: "Sensor Beta registrou temperatura acima de 60°C no Setor Leste – Vale do Paranã. Possível foco ativo de queimada. Equipe de campo notificada para inspeção imediata.",
      severity: "critical"
    });

    await storage.createAlert({
      sensorId: s1id,
      title: "🌡️ Temperatura Crítica no Cerrado",
      message: "A temperatura no Setor Norte atingiu 42°C, superando o limiar de risco para incêndios. Umidade relativa abaixo de 15%. Risco de propagação de fogo é MUITO ALTO.",
      severity: "critical"
    });

    await storage.createAlert({
      sensorId: s3id,
      title: "💨 Qualidade do Ar – Nível Prejudicial",
      message: "Índice de Qualidade do Ar (IQA) atingiu 185 μg/m³ no Setor Sul. Partículas finas (PM2.5) em concentração prejudicial à saúde. Evite atividades ao ar livre.",
      severity: "critical"
    });

    await storage.createAlert({
      sensorId: s1id,
      title: "⚠️ Risco Elevado de Queimada",
      message: "Condições meteorológicas favoráveis a incêndios detectadas: ventos de 40 km/h, umidade 18%, temperatura 38°C. Período de seca prolongada na região há 45 dias.",
      severity: "medium"
    });

    await storage.createAlert({
      sensorId: s2id,
      title: "📡 Falha de Comunicação – Estação Beta",
      message: "A Estação Beta não transmite dados há 2 horas. Pode indicar dano físico por incêndio, queda de energia ou falha de rede. Manutenção preventiva solicitada.",
      severity: "medium"
    });

    await storage.createAlert({
      sensorId: s3id,
      title: "🌧️ Período de Seca Severa",
      message: "Dados meteorológicos indicam 52 dias sem chuva no Cerrado Central. Reservatórios locais abaixo de 20% da capacidade. Alerta de escassez hídrica para municípios da região.",
      severity: "medium"
    });

    await storage.createAlert({
      sensorId: s1id,
      title: "ℹ️ Atualização do Sistema CERES AI",
      message: "Módulo de análise preditiva atualizado para versão 2.1. Novo algoritmo de detecção de focos com 94% de precisão integrado. Dados históricos do INPE incorporados à base.",
      severity: "low"
    });

    const resolved = await storage.createAlert({
      sensorId: s2id,
      title: "✅ Foco Controlado – Setor Leste",
      message: "Foco de incêndio no Setor Leste contido com sucesso pelas equipes do IBAMA. Área de 12 hectares afetada. Reflorestamento emergencial será iniciado em 30 dias.",
      severity: "medium"
    });
    await storage.resolveAlert(resolved.id);

    console.log("Alertas re-semeados em Português!");
  }
}
