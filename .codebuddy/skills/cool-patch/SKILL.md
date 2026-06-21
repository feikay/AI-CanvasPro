---
name: cool-patch
description: |
  Apply COOL API vendor integration patches to AI-CanvasPro. This skill should be used 
  when the user needs to re-apply COOL patches after a version update, when the upstream 
  repository has been pulled and COOL integration needs to be restored, or when the user 
  asks to "apply COOL patches", "re-apply patches after update", "update COOL vendor", 
  "re-run COOL patches", or similar. It handles both auto-patching of non-obfuscated 
  files (index.html, server.py) and manual patching of 10+ obfuscated JavaScript files.
---

# COOL Patch - AI-CanvasPro Vendor Integration

Apply all COOL (MJ API) vendor patches to the AI-CanvasPro project. This skill
covers both automated script-based patching and manual obfuscated-file patching.

## When to Use

- After running `git pull upstream main` (version update wipes patches)
- After switching to a new branch that doesn't have COOL integration
- User asks to "apply COOL patches" / "re-apply patches" / "update COOL vendor"
- COOL-related functionality is missing after a merge or rebase

## Workflow

### Step 1: Run Auto-Patch Script

Execute the automated patch script for non-obfuscated files:

```bash
cd <project-root> && node patches/apply-patches.js
```

This handles:
- `index.html` — Insert COOL API key card HTML
- `backend/services/remote_proxy_route_service.py` — Add COOL proxy routes

### Step 2: Apply Obfuscated File Patches

Read `references/obfuscated-patches.md` for the complete list of patches to
apply to obfuscated JavaScript files. Apply each patch in order using exact
string replacement.

The files to patch (in order):
1. `src/modules/providers.js` — Add COOL to PROVIDERS_META
2. `api/configApi.js` — Add COOL to DEFAULT_SECURE_PROVIDER_IDS
3. `api/providerConnectionTestApi.js` — Add COOL connection test (3 changes)
4. `src/modules/app/appTopbarAndConfig.js` — Add COOL to API key collection array
5. `src/modules/imageFunctionModelMenu.js` — Add COOL to image function menu (2 changes)
6. `src/components/aigenImage/uiModuleModelHelpers.js` — Add COOL image menu HTML (4 changes)
7. `src/components/aigenImage/uiModule.impl.js` — Register COOL submenu toggle
8. `src/components/video-node/parameterPanelModelHelpers.js` — Add COOL video menu helpers (2 changes)
9. `src/components/video-node/parameterPanelModule.js` — Add COOL to video panel (2 changes)
10. `src/manifests/modelRegistry.js` — Register COOL model manifests (3 changes)
11. `src/manifests/image/modelApi/index.js` — Add COOL to image index (3 changes)
12. `src/manifests/video/modelApi/vendorVideoModelApiManifests.js` — Add COOL to video index (6 changes)

For each file:
1. Read the file with `read_file`
2. For each change in the reference, use `search` to locate the insertion point
3. Use `replace_in_file` with the exact old/new strings from the reference

### Step 3: Verify New Files Exist

Verify these new files are present (they should survive version updates):

- `api/adapters/CoolAdapter.js`
- `api/errors/parsers/CoolErrorParser.js`
- `src/manifests/image/modelApi/coolImageManifests.js`
- `src/manifests/video/modelApi/coolVideoManifests.js`
- `patches/vendor-registry.json`
- `patches/apply-patches.js`
- `patches/templates/cool-api-card.html`
- `patches/templates/cool-proxy-routes.py`

If any are missing, re-create them from the patch backup or notify the user.

### Step 4: Run Patch Verification Script

```bash
cd <project-root> && node patches/apply-patches.js
```

Running a second time verifies idempotency — all auto-patches should show
"已存在，跳过" (already exists, skip). If any show "写入" (written), the
file was missing the patch.

## Important: Model Name Validation

After applying patches, verify that `src/manifests/image/modelApi/coolImageManifests.js`
uses correct COOL API model names. The COOL API does NOT support `_4k` suffixed model
names. The following execution manifests MUST use base model names:

| Execution ID | model field must be |
|---|---|
| `cool.model-api.gpt-image-2-4k.v1` | `gpt_image_2` |
| `cool.model-api.nano-banana-2-4k.v1` | `nano_banana_2` |
| `cool.model-api.nano-banana-pro-4k.v1` | `nano_banana_pro` |

The `4K` resolution is controlled by the `resolution` parameter, not the model name.

Also verify `omnihuman_1_5` is NOT present in the image manifest (it is a video model).

## Important: Troubleshooting — COOL Card Duplicates or Mixed with Agnes

If after applying patches the settings page shows:
- COOL and Agnes cards visually mixed/overlapping
- Multiple COOL cards stacked
- Agnes card structure broken (missing outer wrapper)

**Root causes (historical bugs in v1.0.0, fixed)**:

### Bug 1: Idempotency check failure → duplicate cards
- **Symptom**: Running `apply-patches.js` multiple times inserts multiple COOL cards
- **Root cause**: Idempotency check used `data-provider="cool"`, but the template actually uses `data-provider-test="cool"`, so the check never matched
- **Fix**: Use `id="providerKey-cool"` as the idempotency marker (unique input id)

### Bug 2: Wrong insertion anchor → Agnes structure broken
- **Symptom**: COOL card inserted INSIDE Agnes card's `<div class="settings-card-head">`, breaking Agnes layout
- **Root cause**: Anchor was `<div class="settings-card-badge">AG</div>` (Agnes internal badge), so `replace()` put COOL HTML inside Agnes's head div
- **Fix**: Anchor must be the FULL outer wrapper: `<div class="settings-section settings-card"><div class="settings-card-head"><div class="settings-card-badge">AG</div>`

### Recovery procedure (if bugs occur)
```bash
# 1. Restore index.html from clean master
git checkout master -- index.html

# 2. Re-run patch (with fixed apply-patches.js)
node patches/apply-patches.js

# 3. Verify only ONE COOL card exists
# Search for 'providerKey-cool' — should appear exactly once
```

### Verification checklist
- [ ] `providerKey-cool` appears exactly once in `index.html`
- [ ] `settings-card-badge">CL` appears exactly once (the COOL badge)
- [ ] `settings-card-badge">AG` appears exactly once in actual HTML (ignore comments)
- [ ] COOL card is BEFORE Agnes card in source order
- [ ] Both cards have independent `<div class="settings-section settings-card">` outer wrappers

## Important: Browser Cache

After applying patches, the user may need to **hard refresh** the browser
(`Ctrl+Shift+R` or `Ctrl+F5`) to see the changes, as `index.html` is heavily cached.
