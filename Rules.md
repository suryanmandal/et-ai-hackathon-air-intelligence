# VayuSense - System Constraints & Validation Guards

This document defines the strict operational rules, guardrails, and validation policies that govern the VayuSense monitoring and regulatory network.

---

## 1. Municipal Calibration Thresholds

VayuSense settings enforce statutory boundaries configured via the Command Configuration Panel:

- **Critical AQI Breach Threshold**:
  - **Baseline Default**: `200`
  - **Constraint Rule**: Any reading above this level triggers immediate priority warnings to nearby terminals.
- **High-Frequency PM2.5 Ceiling**:
  - **Baseline Default**: `150 µg/m³`
  - **Constraint Rule**: Max ceiling for sustained PM2.5 readings. Exceeding this boundary flags immediate dispatch validation pipelines.
- **Sensor Drift Tolerance**:
  - **Baseline Default**: `±12%`
  - **Constraint Rule**: Automatic calibration drift bounds before triggering hardware recalibration alerts.

---

## 2. Automated Enforcement & Security Policies

To ensure non-repudiation and strict compliance, the following policy toggles are active:

### A. Strict Facial Consistency Mode (AR Field Subsystems)
- **Constraint Policy**: When enabled, field operators using Augmented Reality (AR) HUD terminals must maintain biometric verification. If biometric face consistency falls below `100%`, command feeds, routing instructions, and override panels are automatically locked out to prevent unauthorized field operations.

### B. Immediate Multi-Agent Compliance Filing
- **Constraint Policy**: Any warning or spike flagged by a `SensorAgent` must be attributed by a `SourceAttributionAgent` and registered by a `ComplianceAgent` in under `1000ms`. Compliance files must include spatial PostGIS verification signatures.

### C. Bypass Regional Language Translation Cache
- **Constraint Policy**: When active, translation cache files are ignored to ensure that real-time emergency warnings fetch localized strings directly from MPCB/BMC baseline maps rather than using local disk cache.

---

## 3. Statutory Override Controls

Bypassing environmental guardrails is strictly guarded:
- **Authentication**: Requires Level 4 Executive Directorate tokens and passcode input `VAYU-2026`.
- **Bypass Scope**:
  - *Warning Broadcasts Override*: Mutes public broadcast alarms.
  - *Industrial Emissions Capping Override*: Suspends regulatory caps for active factory outputs.
  - *Traffic Flow Diverters Override*: Disables automated road segment rerouting.
- **Immutable Log**: All override parameters and security credentials are mathematically signed and written directly to the GovChain Ledger.
