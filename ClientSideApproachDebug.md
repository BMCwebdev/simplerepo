# Client-Side FontAwesome Loading Debug Log

## Current Status

We've attempted the FontAwesome library approach (using `library.add()` and string tuples like `['fas', 'heart']`), but it's still triggering the SWC StyleX plugin crash with `Object.entries requires an object` at `evaluate.rs:1336`.

This suggests that the mere presence of FontAwesome imports at the module level is enough to cause the SWC plugin to crash, even when we're using the library approach with string tuples instead of direct icon objects.

## Next Approach: Client-Side Loading

Based on previous successful testing in the debug log, we're now implementing the client-side loading approach. Key elements:

1. **No FontAwesome imports at the module level** - This is the most critical aspect
2. **Unicode fallback icons** - For server-side rendering
3. **Dynamic imports in useEffect** - To load FontAwesome only in the browser
4. **Hydration handling** - Using suppressHydrationWarning to avoid React errors

### Implementation Plan

1. Create `IconClient.tsx` component:

   - No module-level FontAwesome imports
   - Uses useEffect to load FontAwesome only on the client
   - Shows Unicode fallbacks during SSR
   - Uses suppressHydrationWarning

2. Update Button to use IconClient:

   - Either modify the Button component directly
   - Or create a ButtonWithClientIcon that imports IconClient

3. Update index-client.ts to export the client-safe components:

   - Export IconClient as Icon
   - Export modified Button or ButtonWithClientIcon as Button
   - Export other components (Keyboard, Card, Text, Heading, etc.)

4. Add build-client script to package.json and vite.config.ts entry point

### Expected Outcome

The client-side loading approach should work because:

1. It completely avoids FontAwesome module imports that trigger static analysis
2. SWC only sees simple React components with strings during compile time
3. FontAwesome is loaded entirely at runtime in the browser

### Testing Steps

1. Implement the approach
2. Build with `npm run build-client`
3. Test in testapp with the SWC StyleX plugin enabled
4. Document any issues or success

## Debug Notes

### Implementation (April 22, 2025)

1. Created `IconClient.tsx`:

   - No module-level FontAwesome imports
   - Uses useState for the fallback Unicode icon
   - Uses useEffect to dynamically import FontAwesome and set the icon
   - Includes suppressHydrationWarning to prevent React hydration errors
   - Implements the same API as the original Icon component
   - Uses direct icon property access via switch statements for type safety
   - Uses `any` types for dynamically imported FontAwesome components to avoid TypeScript errors

2. Created `ButtonWithClientIcon.tsx`:

   - Imports and uses IconClient instead of the original Icon
   - Otherwise maintains the exact same functionality and API as the original Button

3. Created `index-client.ts`:

   - Exports IconClient as Icon and ButtonWithClientIcon as Button
   - Also exports Keyboard, Card, Text, and Heading components

4. Updated `vite.config.ts`:

   - Added VITE_CLIENT option to use the index-client.ts entry point

5. Updated `package.json`:
   - Added build-client script that uses the VITE_CLIENT flag

### Next Steps

To test this implementation:

1. Run `cd /Users/brian.mccarthy/Development/sherlockSWC/stitch/packages/stitch-extension && npm run build-client`
2. Test in testapp with the SWC StyleX plugin enabled
3. If it works, implement this approach for other components that depend on FontAwesome
