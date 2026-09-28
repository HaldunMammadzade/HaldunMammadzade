# Texniki arxitektura

## Ümumi baxış

```
                    ┌─────────────────────────────────┐
                    │         API Gateway / CDN        │
                    └─────────────────────────────────┘
                      │           │            │
          ┌───────────┘           │            └───────────┐
          ▼                       ▼                        ▼
   ┌──────────────┐      ┌──────────────┐         ┌──────────────┐
   │ Web Admin    │      │ REST/GraphQL │         │ Realtime     │
   │ (Next.js)    │      │ API          │         │ (WebSocket)  │
   │ direktor/    │      │ (Node/Nest)  │         │ chat, live   │
   │ mühasib      │      └──────┬───────┘         └──────────────┘
   └──────────────┘             │
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
              PostgreSQL    Redis       Object Storage
              (tenant RLS)  (cache/     (S3-compatible
                            queue)       media)
                    │
                    ▼
              Worker jobs (faktura, push, SMS, digest)
```

## Mobil (tövsiyə: **React Native + Expo**)

| App | Store adı | Qeyd |
|-----|-----------|------|
| **Bağça Valideyn** | ayrı listing | OTP, push (FCM/APNs) |
| **Bağça Pro** (staff) | ayrı listing | rol əsaslı UI — bir binary |

**Səbəb:** valideyn UX sadə qalmalı; staff app-də pickup və sürətli davamiyyət var — eyni app-də qarışıqlıq yaradır.

**Paylaşılan kod:**
- `packages/domain` — tiplər, validation (Zod), biznes qaydaları
- `packages/api-client` — OpenAPI-generated hooks
- `packages/i18n` — az, ru (gələcək)

**Mobil texnologiyalar:**
- Expo Router, TypeScript
- Secure storage: refresh token
- Camera + compressed upload (chunked)
- Offline: SQLite queue (staff attendance)

## Backend

- **NestJS** (modul strukturu biznes modullara uyğun) və ya **Hono + modular services** — komanda ölçüsünə görə.
- **PostgreSQL** + Row Level Security `tenant_id`.
- **Prisma** ORM + migration.
- **BullMQ** — notifications, invoice generation.
- **Auth:** phone OTP (SMS provider: local AZ), JWT access (15m) + refresh (30d), device binding optional.

## API dizaynı

- REST, versiya `/v1`
- Webhook: ödəniş provider (fase 2)
- Idempotency-Key kritik əməliyyatlarda (ödəniş, check-out)

## Media pipeline

1. Client → presigned upload URL
2. Worker: thumbnail, optional face blur
3. Metadata DB; CDN URL tenant-scoped signed URLs

## Realtime

- Mesaj və check-in bildirişləri: WebSocket və ya Firebase-compatible bridge
- Push həmişə backup

## DevOps

- Staging + Production (EU və ya TR region — latency AZ üçün)
- Backup gündəlik; RPO 24h, RTO 4h (SMB SLA)
- Sentry, structured logs, tenant_id in every log line

## Təhlükəsizlik

- TLS everywhere, certificate pinning (mobil, optional)
- Rate limit OTP endpoints
- Brute force pickup PIN lockout
- Pen test before v1 online payments

## Monorepo (Turborepo)

```
kindergarten-platform/
  apps/
    api/
    web-admin/
    mobile-parent/     # Expo
    mobile-staff/      # Expo
  packages/
    domain/
    api-client/
    i18n/
    eslint-config/
```

## OpenAPI

Single source: API schema → mobile + web client generate → contract tests.
