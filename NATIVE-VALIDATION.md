# Native preparation — validation

Passed in the local Linux environment:

- `npx tsc --noEmit --pretty false`.
- `npm run test:native`: 8 tests for fixed final-minute dates, early-completion cancellation, completed/already-notified timers, resume after expiry, tutorial suppression, penalty readiness, Zagreb midnight/DST, and the pending-notification cap.
- `npm run test:native:ui`: embedded app executed under JSDOM with mocked native platform/auth. Verified native Health/alert buttons, no web GPS or localhost DEV panel on iOS, absolute kilometre readings, one 10 km XP/stat award, rejection of stale-day samples and 20 km display cap.
- `npm run ios:sync`: Next.js 16.2.4 static production build succeeded; Capacitor copied native assets and resolved the App and Local Notifications plugins. This build used explicitly fake Supabase values for compilation only; no live Supabase/Health account was tested.
- iOS Info.plist, entitlements and app privacy manifest parse successfully. HealthKit plugin registration and target entitlements are wired into the generated Xcode project.

Not executed here:

- Swift compilation against an Apple SDK, Xcode simulator/device run, code signing, App Store Connect/TestFlight upload, or Apple review.
- Real HealthKit permissions, distance sensor accuracy, iOS background wake/delivery cadence, physical-device notification delivery/Focus settings, or cross-device live account sync.
- `.github/workflows/ios-check.yml` is provided for a manual macOS simulator compilation check, but was not run remotely.

No generated web bundle is shipped in this source ZIP: rebuild with your own existing `.env.local` using `npm run ios:sync`. This prevents the compilation-only placeholder configuration from being used as a real app.
