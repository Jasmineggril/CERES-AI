---
name: CERES AI Color Palette
description: Official color tokens and their usage rules
---

Defined in `client/src/index.css` as CSS variables and used throughout the app.

| Token | Hex | HSL (CSS var) | Usage |
|---|---|---|---|
| Verde Institucional | #0F5132 | 153 69% 19% | --primary; navbar, main buttons, titles |
| Verde Agrícola | #2E7D32 | 123 46% 33% | secondary highlights, card accents |
| Verde Claro | #81C784 | 123 39% 64% | hover states, charts, secondary elements |
| Dourado Ceres | #C9A227 | 43 68% 47% | --accent; badges, medals, premium. Max 10% usage |
| Azul Geoespacial | #1976D2 | 213 80% 46% | maps, links, geo-related elements |
| Branco | #FFFFFF | 0 0% 100% | --card; main background |
| Cinza Claro | #F5F7F8 | 200 17% 97% | --background; cards, alternate sections |
| Cinza Escuro | #263238 | 201 19% 18% | --foreground; text, footer bg |

**Why:** Official CERES AI palette approved for haCARthon 2026 submission. GovTech + sustainability aesthetic inspired by Gov.br, MapBiomas, ArcGIS.

**How to apply:** Use inline `style={{ color: "#0F5132" }}` for specific brand colors, or use Tailwind classes mapped to CSS variables. Do NOT use generic `emerald-*` Tailwind classes for primary actions — always use the institutional green #0F5132.
