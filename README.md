# CERES AI

**Seu CAR mais simples, inteligente e acessível.**

<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/f5b88641-e0d6-4597-8b7e-9f4ca78b18cd" />

> Transformando dados ambientais em decisões inteligentes.

Desenvolvido para o **haCARthon 2026** — Maratona Nacional de Soluções para o Cadastro Ambiental Rural (CAR), promovida pela ENAP, MGI, FBDS e Governo da Noruega.

---

## Nossa História

O Cadastro Ambiental Rural (CAR) é uma das mais importantes ferramentas de gestão ambiental do Brasil. Ele conecta produção rural, preservação ambiental e desenvolvimento sustentável, sendo essencial para o acesso a crédito rural, programas governamentais e regularização ambiental.

Apesar de sua importância, milhões de produtores rurais ainda enfrentam dificuldades para compreender a legislação ambiental, interpretar mapas, corrigir pendências e utilizar sistemas digitais complexos.

Foi observando esse cenário que nasceu o **CERES AI**.

Criado durante o **haCARthon 2026**, o CERES AI foi concebido para aproximar tecnologia, sustentabilidade e inclusão digital. Nossa missão é transformar um processo burocrático e técnico em uma experiência simples, acessível e inteligente.

Inspirado em **Ceres**, a deusa romana da agricultura, fertilidade da terra e prosperidade, o projeto representa a união entre tradição, inovação e responsabilidade ambiental.

Mais do que uma plataforma tecnológica, o CERES AI busca democratizar o acesso à informação ambiental e fortalecer a regularização ambiental no Brasil por meio da Inteligência Artificial.

---

## O Problema

Milhões de produtores rurais dependem do CAR para manter suas propriedades regularizadas e acessar benefícios importantes. Entretanto, muitos enfrentam dificuldades para:

- Entender a legislação ambiental (APPs e Reservas Legais)
- Interpretar mapas ambientais georreferenciados
- Corrigir inconsistências cadastrais
- Compreender notificações dos órgãos ambientais
- Utilizar plataformas digitais complexas

Enquanto isso, órgãos ambientais lidam com grande volume de dados, retrabalho por erros cadastrais e processos lentos de análise e validação.

---

## Nossa Solução

O CERES AI atua como um **assistente inteligente de regularização ambiental**.

A plataforma combina Inteligência Artificial, geotecnologia e experiência do usuário para transformar informações complexas em orientações simples, claras e acionáveis.

**Menos burocracia. Mais compreensão. Mais regularização.**

---

## Funcionalidades

### CERES Assistente
Chatbot especializado em CAR, Código Florestal, APP e Reserva Legal. Responde dúvidas em linguagem simples e acessível, sem jargão técnico.

### CERES Diagnóstico
Analisa informações cadastrais do imóvel rural para identificar pendências, detectar inconsistências, apontar riscos e gerar recomendações automáticas de regularização.

### CERES Maps
Visualização geoespacial interativa de APPs, Reservas Legais, nascentes, áreas consolidadas, uso e cobertura do solo e alertas ambientais no Cerrado.

### CERES Aprende
Central educacional que traduz a legislação ambiental para linguagem simples. Inclui tutoriais, guias rápidos, glossário ambiental e exemplos práticos.

### CERES Insights
Dashboard estratégico para gestores públicos e analistas ambientais. Permite acompanhar pendências, evolução da regularização, indicadores e áreas prioritárias.

---

## Para Quem Foi Criado

### Seu Raimundo — Produtor Rural
Pequeno e médio produtor rural que busca manter sua propriedade regularizada, evitar multas, acessar crédito rural e compreender melhor suas obrigações ambientais.

### Luana — Analista Ambiental
Analista responsável por orientar produtores, validar informações e apoiar processos de regularização ambiental. Precisa de eficiência e dados confiáveis.

---

## Impacto Esperado

- **40%** menos erros cadastrais
- **60%** menos dúvidas recorrentes nos órgãos ambientais
- **30%** menos retrabalho dos analistas
- **50%** mais compreensão da legislação ambiental
- Maior inclusão digital no meio rural
- Fortalecimento da governança ambiental brasileira

---

## Alinhamento com o haCARthon 2026

O CERES AI foi desenvolvido para atender diretamente aos desafios estratégicos do haCARthon:

| Desafio | Resposta do CERES AI |
|---|---|
| Desafio 1 — Simplificação do CAR | Assistente IA + Diagnóstico Automatizado + Linguagem Simples |
| Desafio 3 — Entendimento da legislação | Tradução de linguagem técnica + CERES Aprende |

Nossa proposta combina Inteligência Artificial, acessibilidade e educação ambiental para tornar a regularização ambiental mais simples, eficiente e inclusiva.

---

## Bem Público Digital

O CERES AI foi concebido seguindo princípios de:

- **Código Aberto** — Desenvolvido com transparência e colaboração
- **Interoperabilidade** — Integrado com SICAR, INPE, IBGE e MapBiomas
- **Escalabilidade** — Do municipal ao federal, sem restrições de porte
- **Reutilização** — Modular, adotável por qualquer ente público

Nossa visão é contribuir para a evolução do CAR como um verdadeiro **Bem Público Digital**.
-------
<img width="2048" height="2048" alt="instruçoes" src="https://github.com/user-attachments/assets/f0defb79-4273-49e4-a667-84bcd2aa946d" />

-------

## Missão

Democratizar o acesso à informação ambiental por meio da tecnologia, promovendo inclusão, sustentabilidade e regularização ambiental para todos os produtores rurais brasileiros.

## Visão

Ser referência nacional em Inteligência Artificial aplicada à regularização ambiental e à transformação digital da gestão pública.

## Valores

Sustentabilidade · Transparência · Ética · Inovação · Inclusão Digital · Acessibilidade · Responsabilidade Ambiental · Impacto Social · Governo Aberto

---

## Arquitetura Técnica

```
client/           — React 18 + TypeScript (frontend)
  src/
    components/   — Componentes reutilizáveis
    pages/        — Páginas de rota
    hooks/        — Hooks customizados
server/           — Express.js (backend)
  routes.ts       — Rotas da API
  storage.ts      — Camada de dados
shared/           — Tipos e schemas compartilhados
  schema.ts       — Schema Drizzle + PostgreSQL
```

**Stack:** React · TypeScript · Node.js · Express · PostgreSQL · Drizzle ORM · TanStack Query · Tailwind CSS · shadcn/ui · Recharts · Wouter

**APIs:** Open-Meteo (clima) · INPE (focos de calor) · MapBiomas (cobertura do solo)

---

## Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Copie o exemplo de variáveis de ambiente para o arquivo .env local
cp .env.example .env

# Configure DATABASE_URL para sua conexão PostgreSQL local ou Supabase
# Exemplo Supabase:
# DATABASE_URL="postgresql://usuario:senha@dbhostname.supabase.co:5432/postgres"

# Iniciar o servidor de desenvolvimento
npm run dev

# Aplicar migrações do banco
npx drizzle-kit push
```

---

## Roadmap

### Fase 1 — MVP (haCARthon 2026)
- CERES Assistente IA
- CERES Diagnóstico
- CERES Maps interativo
- Dashboard inicial
- Simulação "Seu Raimundo"
- Sistema de gamificação

### Fase 2 — Expansão (2027)
- Aplicativo mobile (iOS e Android)
- Assistente por voz em português
- Modo offline para áreas rurais
- Relatórios inteligentes em PDF
- Painel avançado para analistas

### Fase 3 — GovTech (2028)
- Integração com SICAR
- APIs abertas para órgãos públicos
- Ferramentas para secretarias estaduais
- Automação de análises cadastrais

### Fase 4 — Bem Público Digital (2029+)
- Plataforma open source completa
- Arquitetura modular reutilizável
- Expansão para outros estados e biomas
- Expansão internacional (América Latina)

---

## Equipe

### Jasmine de Sá Araújo — Co-Founder & CEO
Estudante de Engenharia de Software na Universidade do Distrito Federal (UnDF).

Responsável pela visão estratégica, produto, inovação pública, impacto socioambiental e desenvolvimento institucional do CERES AI.

- LinkedIn: https://www.linkedin.com/in/jasmine-d-7b9ab7187
- E-mail: jasminedesarauj@gmail.com

### Pedro Henrique Bento Martins — Co-Founder & CTO
Estudante de Engenharia de Software no UNICEPLAC.

Responsável pela arquitetura tecnológica, desenvolvimento Full Stack, segurança, escalabilidade e evolução da plataforma.

- LinkedIn: https://www.linkedin.com/in/pedro-henrique-bento-martins-7b19a733a
- E-mail: pbentomartins4569@gmail.com

---

## Por Que Agora?

O Brasil possui mais de 8 milhões de imóveis cadastrados no CAR e enfrenta desafios crescentes relacionados à regularização ambiental, monitoramento territorial e acesso à informação.

A combinação entre Inteligência Artificial, geotecnologia e transformação digital cria uma oportunidade única para tornar o CAR mais acessível, eficiente e inclusivo.

O CERES AI nasce exatamente nesse momento para construir uma nova geração de serviços públicos digitais voltados à sustentabilidade.

---

**CERES AI — Menos burocracia. Mais inteligência ambiental.**

*Tecnologia para proteger o território. Inteligência para preservar o futuro.*

haCARthon 2026 · ENAP · MGI · FBDS · Governo da Noruega
