# Beyond Leveling — iOS preparation

This project now contains a Capacitor iOS project, an on-device HealthKit reader and local timer/penalty notifications. The existing Vercel build remains `npm run build`. This is preparation for device testing, not an App Store-ready release.

## What is implemented

- Gym shows CONNECT APPLE HEALTH and ENABLE ALERTS in the iOS app.
- HealthKit supplies today's walking **and** running distance, using Europe/Zagreb midnight boundaries. Manually entered Health samples are excluded.
- Distance updates use an absolute daily total, not increments, so repeated reads do not add the same kilometres again. Display caps at 20 km; the existing 10 km quest awards its normal XP once per day when the app receives the data and progression is active.
- The web GPS tracker is bypassed on iOS to avoid counting the same distance twice. The current web GPS behavior and Indoor Mode remain available in their existing environments.
- Apple Health records distance independently of this app. The app refreshes while visible, on resume, and on available HealthKit background updates. iOS decides background delivery timing. Quest completion/XP may update when the app next runs; exact instant background XP is not promised.
- Timer final-minute reminders and penalty-ready reminders are scheduled with iOS Local Notifications. Completing a quest early removes its pending reminder. Logout clears this app's managed reminders. Foreground reminders use the existing System presentation instead of a duplicate native banner.
- No GPS route recording, all-day continuous GPS, Apple Watch app, Google Health Connect, push server, or guaranteed reminder after permissions are denied is included.
- Prayer and randomly assigned urgent-quest background notifications are not included in this first native schedule. Their existing in-app behavior remains.

## Install dependencies

Keep your existing `.env.local` in the project root. Do not upload it or put secret/service-role keys in the app. The native bundle needs only:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your-existing-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-existing-publishable-key
```

Use Node 22.18+ (Node 24 LTS recommended for the included test command), then:

```bash
npm ci
npm run test:native
npm run ios:sync
```

`ios:sync` builds a separate static copy under `native-web`, omitting the server-only Stripe route from that copy. The web API source remains in `app/api` for Vercel. No native purchases/paywall have been added.

The exported copy uses the embedded screens' existing fonts and does not download Google Fonts while building. The Vercel layout remains unchanged.

## Mac / Xcode

Use a Mac and the Xcode version required by the installed Capacitor version (see its Environment Setup documentation). Run:

```bash
npm run ios:open
```

In Xcode:

1. Select App → Signing & Capabilities → your own Apple Developer team.
2. Confirm the bundle identifier `com.beyondagency.beyondleveling` is available to your team; change it in `capacitor.config.ts` and the Xcode target if needed.
3. Confirm HealthKit capability and HealthKit Background Delivery are enabled for the App ID and signing profile. `App/App.entitlements` is already connected to the target.
4. Select your iPhone, enable Developer Mode if Xcode requests it, and run App.
5. Log in to your existing account, complete the tutorial if necessary, then open Gym and tap CONNECT APPLE HEALTH. Allow reading walking/running distance. Tap ENABLE ALERTS and allow notifications.

Health read authorization is intentionally private: Apple's permission-request completion does not tell an app whether the user actually allowed reads. Zero distance can mean no available data or missing permission. Verify access in the Health app if needed.

The provided project has no signing team, certificates, provisioning profiles or paid developer credentials. Public TestFlight/App Store distribution requires your Apple Developer setup. No build has been uploaded or submitted.

## Windows / cloud Mac

You can edit the project and prepare its web bundle on Windows. Xcode compilation and device signing still run on a Mac (local, borrowed, or a configured macOS build service). `.github/workflows/ios-check.yml` provides a **manually triggered simulator compilation check** on a GitHub macOS runner. It does not publish an app, sign an installable device build or submit to TestFlight.

For a signed cloud build, configure your chosen service with your own Apple Developer team and signing credentials. Supply the two public Supabase values as build variables. Never commit signing credentials or an App Store Connect private key.

## Device acceptance checks

1. Compare the day's distance with Health's Walking + Running Distance. Carry the phone for the test. Check another read of the same total does not add distance.
2. Lock the phone and walk/run, reopen the app, and verify the new total appears. Repeat with another app foregrounded. Check HealthKit background delivery on a real device; simulator data alone is insufficient.
3. Reach 10 km and verify exactly one quest completion/XP award, including after a reload and login. Check daily reset and the 20 km display cap.
4. Start a Gym timer, minimize it, lock the phone and check the final-minute alert. Repeat with Side Hustle/Business, then confirm early and verify no obsolete alert arrives.
5. Check a stored penalty's ready reminder and tap the notification to open Penalty Zone.
6. Log out with a pending timer and verify its reminder is canceled; log in as another user and check no previous user's reminders/progress appear.
7. Deny Health/notification access, reopen and check the app remains usable with explanatory messages.
8. Validate notification behavior with Silent Mode/Focus settings separately. The app cannot override the user's iOS notification settings.

Before public release: run a real signed iPhone/TestFlight build, finish account recovery/deletion and privacy disclosures, review artwork/name/content permissions, and complete App Store review preparation. No Apple approval is assumed.

## Validation performed in this environment

See `NATIVE-VALIDATION.md`. No iOS SDK or physical iPhone is available here; Swift/HealthKit runtime and signed-device behavior must be verified with Xcode.
