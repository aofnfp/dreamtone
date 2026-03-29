# Deployment Runbook — DreamTone

## Prerequisites

- Node.js 20+
- EAS CLI: `npm install -g eas-cli`
- Expo account with project linked: `eas login`
- GitHub repo secrets configured (see below)

## GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `EXPO_TOKEN` | Expo access token for EAS builds |

## EAS Environment Secrets (set via `eas secret:create`)

| Secret | Description |
|--------|-------------|
| `SENTRY_DSN` | Sentry project DSN |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source maps |

## Build Profiles

| Profile | Purpose | Android Output | iOS Output |
|---------|---------|---------------|------------|
| `development` | Local dev + simulator | APK | Simulator build |
| `preview` | Internal testing | APK | Ad-hoc IPA |
| `production` | Store release | AAB | App Store IPA |

## CI/CD Pipeline

### Automatic (on PR to main)
- Lint check (`expo lint`)
- TypeScript check (`tsc --noEmit`)

### Automatic (on push to main)
- Preview builds for both platforms via EAS Build

### Manual Store Submission
```bash
# 1. Build production binaries
eas build --platform all --profile production

# 2. Submit to stores (requires credentials configured in eas.json)
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

## First-Time Store Setup

### Apple App Store
1. Get Apple Developer Team ID and Apple ID from board
2. Create App Store Connect app record
3. Update `eas.json` submit.production.ios with real values
4. Configure code signing: `eas credentials`

### Google Play Store
1. Get Google Play service account JSON from board
2. Place as `google-play-service-account.json` in project root (gitignored)
3. Or upload to EAS secrets: `eas secret:create --name GOOGLE_PLAY_SERVICE_ACCOUNT --type file --value ./google-play-service-account.json`
4. Create Google Play app listing manually first

## Environment Variables

- Development: Use `.env.local` (copy from `.env.example`)
- EAS Builds: Set via `eas secret:create` for production values
- CI: Set via GitHub repo secrets

## Monitoring

- Sentry: Configure DSN in EAS secrets after project creation
- Crash-free rate target: 99.5%+

## Rollback

1. Identify the last stable build in EAS dashboard
2. Submit that build to stores: `eas submit --platform all --id <BUILD_ID>`
3. For critical issues, use store-level rollback features
