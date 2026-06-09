# Specimen Chain Of Custody Console

[![CI](https://github.com/mizcausevic-dev/specimen-chain-of-custody-console/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/specimen-chain-of-custody-console/actions/workflows/ci.yml)
[![Deploy](https://github.com/mizcausevic-dev/specimen-chain-of-custody-console/actions/workflows/pages.yml/badge.svg)](https://github.com/mizcausevic-dev/specimen-chain-of-custody-console/actions/workflows/pages.yml)

Operator control plane for biotech and diagnostics specimen custody, labeling integrity, cold-chain posture, handoff continuity, and release-safe remediation.

## What it does

- custody-lane visibility for accession, courier, storage, and consent operators
- offline-safe analysis of synthetic specimen-custody snapshot packets
- buyer-readable release posture for lab operations, pathology logistics, and quality stakeholders
- public routes:
  - `/`
  - `/custody-lane`
  - `/transfer-gaps`
  - `/release-posture`
  - `/verification`
  - `/docs`
- structured API routes:
  - `/api/dashboard/summary`
  - `/api/custody-lane`
  - `/api/transfer-gaps`
  - `/api/release-posture`
  - `/api/verification`
  - `/api/sample`

## Product depth

Specimen Chain Of Custody Console turns lab handoffs into a release-safe evidence packet. The surface is aimed at diagnostics, pathology logistics, quality, accession, courier, and storage teams that need to know which specimen lanes are trustworthy, which packets require repair, and where release confidence is being weakened by avoidable custody drift.

The product is intentionally readable by both business and technical reviewers:

- executives get a short integrity, release, and remediation view for board-ready specimen operations decisions
- lab and quality teams get owners, control families, specimen paths, blocker states, and next remediation moves
- platform reviewers get typed analysis code, JSON APIs, CLI output, synthetic fixtures, screenshots, and CI verification

## What these repos have in common

This repo follows the Kinetic Gain control-plane pattern used across the portfolio: a narrow operating problem becomes a public product surface with evidence, data contracts, verification routes, and deployment metadata. The goal is not a thin landing page. The goal is a reusable proof artifact that can support diligence, sales discovery, product marketing, and technical review.

Shared pattern:

- named operating lane with a buyer-readable problem statement
- synthetic sample data that proves the workflow without exposing patient, specimen, customer, credential, or production system data
- analyzer or service code that produces the same posture the public page displays
- README, screenshots, routes, APIs, CLI, and CI checks that make the repo inspectable
- footer and metadata links that connect the surface back to the broader Kinetic Gain estate

## Operating workflow

1. Ingest a specimen-custody snapshot with accession, label, courier, temperature, consent, storage, and release signals.
2. Normalize the snapshot into custody lanes, transfer gaps, and release-posture packets.
3. Rank blockers by sample-integrity risk, release impact, and remediation urgency.
4. Render the same evidence through CLI output, JSON APIs, static pages, README screenshots, and verification copy.
5. Keep the live surface offline-safe and synthetic so it can be reviewed publicly without leaking specimen identifiers, patient information, or laboratory credentials.

## Screenshots

![Overview](./screenshots/01-overview-proof-v2.png)
![Custody lane](./screenshots/02-custody-lane-proof-v2.png)
![Transfer gaps](./screenshots/03-transfer-gaps-proof-v2.png)
![Release posture](./screenshots/04-release-posture-proof-v2.png)

## CLI

```powershell
npx specimen-chain-of-custody-console .\fixtures\specimen-chain-of-custody.json --format markdown
```

## Local run

```powershell
cd specimen-chain-of-custody-console
npm install
npm run verify
npm run prerender
npm run render:assets
npm run start
```

Then open:

- [http://127.0.0.1:5522/](http://127.0.0.1:5522/)
- [http://127.0.0.1:5522/custody-lane](http://127.0.0.1:5522/custody-lane)
- [http://127.0.0.1:5522/transfer-gaps](http://127.0.0.1:5522/transfer-gaps)
- [http://127.0.0.1:5522/release-posture](http://127.0.0.1:5522/release-posture)

## Live surface

- [https://specimen.kineticgain.com/](https://specimen.kineticgain.com/)

This repo publishes synthetic specimen-custody data only. It does not ship live specimen identifiers, patient information, or laboratory credentials.
