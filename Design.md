# VayuSense - Design Tokens & Visual Specifications

This document defines the core tokens, colors, typography, glassmorphism specs, and styling guidelines implemented across VayuSense.

---

## 1. Design Aesthetic Core

VayuSense is designed as a high-fidelity, military-grade dark command center. It uses subtle borders, scanning animations, glassmorphism panels, and high-visibility status indicators.

---

## 2. Color Palette & Tokens

VayuSense utilizes Tailwind CSS mapped to the following specific color tokens:

### A. Base Neutral System
- **Background Base Layer**: Slate-950 (`#0f172a` / `#0e1511`)
- **Panel Containers**: Slate-900 (`#1e293b` / `#111827`) with transparent opacity values (`/40` or `/50`).
- **Divider Borders**: Slate-800 (`#1f2937` / `#3c4a42`)

### B. High-Visibility Accent Highlights
- **Primary / Active Accent**: Emerald-500 / Primary (`#4edea3` / `#10b981`)
- **Information / Secure Cyan**: Cyan-400 (`#00e5ff` / `#06b6d4`)
- **Warning / Critical Pulse**: Red-500 (`#ef4444`)
- **Warning / Alert Amber**: Amber-500 (`#f59e0b`)

---

## 3. Glassmorphic Properties

All dashboard dashboard layouts use a standard CSS glass overlay layout for panels:

```css
.glass-panel {
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(51, 65, 85, 0.4);
}
```

This ensures panels blend into the dark background grid while maintaining readable content layers.

---

## 4. Typography Mapping

| Font Family | Applied Elements | Font Style |
| :--- | :--- | :--- |
| **Inter** | Titles, labels, navigation, button texts, general copy | Sans-serif UI, Clean |
| **JetBrains Mono** | Coordinates, hashes, tokens, raw logs, JSON outputs, numeric data | Monospace, Scannable |

- **Spacing Specifications**: Monospace telemetry lines use `tracking-tight` or `tracking-wide` configurations to preserve horizontal alignment inside terminals.
- **Font Sizes**: System headers use standard sizes (e.g. `headline-lg` at 32px or `headline-md` at 24px), while telemetry and telemetry metrics use `text-xs` or `text-sm` for details.
