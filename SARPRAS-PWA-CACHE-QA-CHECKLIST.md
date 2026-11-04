# SARPRAS PWA Cache Isolation — QA Checklist

Status: working-copy validation plan; browser/device runtime tests NOT YET EXECUTED.

## Scope and registration audit
- [x] Admin 002 registers `./sw.js` from repository root with scope `./`.
- [x] SMART SCAN 001 registers `./sw.js` from `/sarpras-smart-scan/`.
- [x] Both manifests declare relative `scope: ./`.
- [x] Working copies use separate cache prefixes and named-cache lookups.
- [x] Activation cleanup only removes older caches with the app's own prefix.
- [ ] Working-copy files have not been activated; HTML still registers the baseline `sw.js`.

## Manual runtime test matrix (Chrome Android)
1. Clear site data only on a dedicated test device/profile; do not clear production user data.
2. Deploy working-copy code under the active service-worker filename on a staging branch/site first.
3. Install/open 001 and 002; confirm both load and each has its own service-worker scope.
4. With both apps installed, update/activate 001. Confirm 002 cache remains present and 002 still opens.
5. Update/activate 002. Confirm 001 cache remains present and 001 still opens.
6. Open each app online, then offline. Confirm each app serves its own cached shell.
7. Reconnect; confirm both apps recover and fetch updated resources.
8. Repeat after a version bump; confirm only the older cache with the same app prefix is removed.

## Pass criteria
- 001 activation never deletes any `sarpras-admin-002-pwa-*` cache.
- 002 activation never deletes any `klikra-sarpras-smart-scan-001-*` cache.
- Neither worker serves sibling-app assets from another app's cache.
- Each app's offline navigation fallback is its own `index.html`.
- No console errors, failed app-shell requests, or unexpected sign-outs/data loss.

## Safety notes
- Do not activate working copies on the production branch before staging checks.
- Do not delete localStorage or IndexedDB during cache testing.
- A cache test does not validate Supabase authentication, database synchronization, or GPS attendance.
