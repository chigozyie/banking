// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://8daf63ea48966b8a0a328b955fe01d68@o4510579617955840.ingest.de.sentry.io/4510579620249680",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    // Keep the Replay integration as before
    Sentry.replayIntegration(),
    // The following is all you need to enable canvas recording with Replay
    Sentry.replayCanvasIntegration(),
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
