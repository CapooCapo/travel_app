# GitHub Copilot Workspace Instructions

## Goal
Enable Copilot to contribute safely and quickly in this Expo React Native app with Clerk auth.

## Project type
- React Native (Expo SDK 54)
- TypeScript-based UI in `src/` (screens, components, navigation)
- Authentication with Clerk (`@clerk/clerk-expo`)
- API client using Axios

## Key scripts
- `npm start` => local Metro bundler
- `npm run android` => build/run Android
- `npm run ios` => build/run iOS
- `npm run web` => web version

## Entry points
- `App.tsx` (app shell)
- `index.js` (expo register)

## Important folders
- `src/navigation` (AppNavigator)
- `src/screens` (Auth flows, screens)
- `src/components` (Custom UI widgets)
- `src/services` (`auth.service.ts`, `validator.ts`)
- `src/storage` (`auth.storage.ts`)
- `src/api/client.ts` (axios instance)

## Conventions
- Prefer function components and React hooks
- Keep business logic in `src/services` and `src/api`, UI in `src/screens` and `src/components`
- Use `CustomButton` / `CustomInput` for consistent style
- Keep API dto/formatting in `src/dto` for consistency

## Common tasks
- Add new screen: create folder under `src/screens/*`, screen `.tsx`, style `.ts`, router entry in `AppNavigator.tsx`
- Add network call: `src/api/client.ts` + service wrapper + DTO types in `src/dto`
- Add auth flow: existing `src/screens/Auth/*` can be extended, uses `src/storage/auth.storage.ts`

## Known details
- Expo config in `app.json`, CLI in `eas.json`
- Development path includes `clerk-expo/` for Clerk SDK wrapper; avoid global `window` in native-only code

## Style guidelines for Copilot
- Respond with focused code edits; avoid unlocking more than requested
- When adding features, suggest and include unit/testing stubs if possible (no tests currently in repo)
- Keep changes minimal, preserving the existing pattern (function + style file pairing, service layer). 

## Local environment notes
- `node_modules` is heavy; use `npm install` once before running tasks.
- If TypeScript errors appear, run `npx tsc --noEmit`.

---

## Suggested example prompts
- "Add a profile screen with user name and logout button using Clerk auth, and wire it into navigation."
- "Implement form validation in `src/screens/Auth/login/Login.Screen.tsx` using `src/services/validator.ts`."
- "Create a new API helper in `src/services/travel.service.ts` that fetches destinations via Axios client and handles errors."

## Next agent-customizations
- Create an `agent-customization` hook for `src/screens/Auth/**` tasks (auto generate path and styles)
- Create an `agent-customization` hook for `src/api/**` backend integration tasks (standard request/response handling)
- Create an `agent-customization` instruction for Expo-specific debugging and common emulator issues (fast repro steps)
