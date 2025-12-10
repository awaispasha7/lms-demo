# Fix TypeScript Errors

The TypeScript errors you're seeing are likely due to the TypeScript language server cache. Here's how to fix them:

## Quick Fix (Recommended)

1. **Restart TypeScript Server in VS Code/Cursor:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "TypeScript: Restart TS Server"
   - Press Enter

2. **If that doesn't work, reload the window:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Developer: Reload Window"
   - Press Enter

## Alternative Fix

If restarting doesn't work, try:

1. **Delete TypeScript cache:**
   ```bash
   cd frontend
   rm -rf .next
   rm -rf node_modules/.cache
   ```

2. **Reinstall dependencies:**
   ```bash
   pnpm install
   ```

3. **Restart TypeScript Server** (as above)

## Why This Happens

The TypeScript language server caches type information. When `tsconfig.json` changes, it sometimes doesn't pick up the changes immediately. Restarting the server forces it to re-read the configuration.

## Verification

After restarting, the errors should disappear. The configuration is correct - it's just a cache issue.

