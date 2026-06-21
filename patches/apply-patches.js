#!/usr/bin/env node

/**
 * AI-CanvasPro 厂商补丁引导 + 自动注入脚本
 * 
 * 用途: 读取 vendor-registry.json，自动修补非混淆文件，输出混淆文件手工指引。
 * 
 * 用法: node patches/apply-patches.js [--dry-run]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REGISTRY_PATH = join(__dirname, 'vendor-registry.json');
const DRY_RUN = process.argv.includes('--dry-run');

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
const provider = registry.provider;

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  AI-CanvasPro 厂商接入补丁                                    ║`);
console.log(`║  厂商: ${provider.label} (${provider.id})`.padEnd(62) + '║');
console.log(`║  版本: ${registry['_版本']}  | 上游: ${registry['_上游']}`.padEnd(62) + '║');
console.log(`║  模式: ${DRY_RUN ? 'DRY-RUN (预览不写入)' : 'APPLY (执行写入)'}`.padEnd(62) + '║');
console.log('╚══════════════════════════════════════════════════════════════╝');

function read(path) { return readFileSync(join(ROOT, path), 'utf-8'); }
function write(path, content) {
  if (DRY_RUN) { console.log(`   [DRY-RUN] 将写入: ${path}`); return; }
  writeFileSync(join(ROOT, path), content, 'utf-8');
  console.log(`   ✅ 已写入: ${path}`);
}

// ============================================================
// 1. index.html — 在 APIMart 卡片后插入 COOL 卡片
// ============================================================
function patchIndexHtml() {
  console.log('\n📄 自动修补: index.html');
  const html = read('index.html');

  // 幂等检查：如果 COOL 卡片已存在，跳过
  if (html.includes('id="providerKey-cool"')) {
    console.log('   ⏭️ COOL 卡片已存在，跳过');
    return true;
  }

  // Agnes AI 卡片起始标记（唯一）
  const agnesMarker = '<div class="settings-card-badge">AG</div>';
  if (!html.includes(agnesMarker)) {
    console.log('   ❌ 未找到 Agnes AI 卡片，无法自动插入');
    console.log('   📋 请手动操作: 在 pane-api-input 中 APIMart 卡片后插入 COOL 卡片');
    return false;
  }

  // 读模板
  const tmplPath = join(__dirname, 'templates', 'cool-api-card.html');
  const cardHtml = readFileSync(tmplPath, 'utf-8');

  const newHtml = html.replace(agnesMarker, cardHtml.trim() + '\n' + agnesMarker);
  write('index.html', newHtml);
  console.log('   插入点: APIMart 卡片之后，Agnes AI 卡片之前');
  return true;
}

// ============================================================
// 2. remote_proxy_route_service.py — 添加 COOL 代理路由
// ============================================================
function patchProxyRoutes() {
  console.log('\n🐍 自动修补: backend/services/remote_proxy_route_service.py');
  const pyPath = 'backend/services/remote_proxy_route_service.py';
  let py = read(pyPath);

  // 2a. 在 handle_get 中添加 COOL poll 路由
  const getRouteMarker = 'if path == "/api/v2/proxy/task":';
  if (!py.includes(getRouteMarker)) {
    console.log('   ❌ 未找到 handle_get 路由注册点');
    return false;
  }

  const coolGetRoute = `
        if path == "/api/v2/proxy/cool":
            return self._handle_task_proxy(handler)`;
  
  if (!py.includes('"/api/v2/proxy/cool"')) {
    py = py.replace(
      getRouteMarker + '\n            return self._handle_task_proxy(handler)',
      getRouteMarker + '\n            return self._handle_task_proxy(handler)' + coolGetRoute
    );
    console.log('   ✅ 添加 GET /api/v2/proxy/cool → 复用 _handle_task_proxy');
  } else {
    console.log('   ⏭️ GET /api/v2/proxy/cool 已存在，跳过');
  }

  // 2b. 添加 _handle_cool_generate 方法
  const coolHandlerMethod = `
    def _handle_cool_generate(self, handler):
        """Proxy POST to COOL API: /v1/cool/generate"""
        data, error = self._read_json_request(handler)
        if error is not None:
            return error

        api_url = (data.get("apiUrl") or "").strip()
        api_key = (data.get("apiKey") or "").strip()
        if not api_url or not api_key:
            return self._json_err(400, "Missing apiUrl or apiKey for COOL")

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
        }
        # Remove routing fields before forwarding
        payload = dict(data)
        payload.pop("apiUrl", None)
        payload.pop("apiKey", None)

        return self._post_json_to_remote(
            api_url,
            payload,
            timeout=900,
            error_prefix="COOL API proxy error",
        )`;

  if (!py.includes('_handle_cool_generate')) {
    // Insert before handle_get method
    const handleGetMarker = '\n    def handle_get(self, handler, path):';
    py = py.replace(handleGetMarker, coolHandlerMethod + handleGetMarker);
    console.log('   ✅ 添加 _handle_cool_generate 方法');
  } else {
    console.log('   ⏭️ _handle_cool_generate 已存在，跳过');
  }

  // 2c. 在 handle_post 中添加 COOL submit 路由
  const postStart = py.indexOf('def handle_post');
  const postEnd = py.indexOf('\n    def ', postStart + 1); // 下一个方法
  const postBody = py.substring(postStart, postEnd > 0 ? postEnd : py.length);
  const postReturnNone = '\n        return None';
  const firstPostReturn = postBody.lastIndexOf(postReturnNone);
  if (firstPostReturn > 0) {
    const absPos = postStart + firstPostReturn;
    const coolPostRoute = `
        if path == "/api/v2/proxy/cool":
            return self._handle_cool_generate(handler)`;
    if (!postBody.includes('"/api/v2/proxy/cool"')) {
      const before = py.substring(0, absPos);
      const after = py.substring(absPos);
      py = before + coolPostRoute + after;
      console.log('   ✅ 添加 POST /api/v2/proxy/cool → _handle_cool_generate');
    } else {
      console.log('   ⏭️ POST /api/v2/proxy/cool 已存在，跳过');
    }
  }

  write(pyPath, py);
  return true;
}

// ============================================================
// 3. 混淆文件 — 输出手工操作指引（含可复制代码）
// ============================================================
function printObfuscatedGuide() {
  console.log('\n🔒 手工修补: 混淆 JS 文件');
  console.log('   ─────────────────────────────────────────────────');

  const targets = registry.patchTargets;
  let idx = 1;
  for (const [key, info] of Object.entries(targets)) {
    if (!info || !info.file) continue;
    if (!info.changes || info.changes.length === 0) continue;
    const file = info.file;

    console.log(`\n${'═'.repeat(62)}`);
    console.log(`  ${idx}. ${file}`);
    if (info.note) console.log(`     ${info.note}`);
    console.log(`${'═'.repeat(62)}`);

    for (let ci = 0; ci < (info.changes || []).length; ci++) {
      const ch = info.changes[ci];
      console.log(`\n     ${ch.what}`);

      if (ch.search) {
        console.log(`     📍 搜索定位: ${ch.search}`);
      }

      if (ch.code) {
        console.log(`     ${ch.insertBefore ? '📋 粘贴到这行前面:' : '📋 替换搜索到的内容为:'}`);
        // JSON 中的 \\n 经 JSON.parse 后变成 \n (一个字面反斜杠+n)
        // 需要把 \n 还原为真换行符显示
        const displayCode = ch.code.replace(/\\n/g, '\n');
        displayCode.split('\n').forEach(line => {
          console.log(`        ${line}`);
        });
      }
    }

    idx++;
  }
}

// ============================================================
// 4. 新增文件清单
// ============================================================
function printNewFiles() {
  console.log('\n✅ 已就绪的新文件（无需操作）');
  console.log('   ─────────────────────────────────────────────────');
  const files = [
    'api/adapters/CoolAdapter.js',
    'api/errors/parsers/CoolErrorParser.js',
    'src/manifests/image/modelApi/coolImageManifests.js (10个图片模型)',
    'src/manifests/video/modelApi/coolVideoManifests.js (25个视频模型)',
    'patches/vendor-registry.json (配置定义)',
    'patches/templates/cool-api-card.html (HTML模板)',
    'patches/templates/cool-proxy-routes.py (PY模板·备用)',
  ];
  for (const f of files) {
    const full = join(ROOT, f.split(' ')[0]);
    console.log(`   ${existsSync(full) ? '✅' : '⚠️'} ${f}`);
  }
}

// ============================================================
// Main
// ============================================================

const htmlPatched = patchIndexHtml();
const proxyPatched = patchProxyRoutes();
printObfuscatedGuide();
printNewFiles();

console.log(`
═══════════════════════════════════════════════════════════════
  自动修补: ${[htmlPatched, proxyPatched].filter(Boolean).length}/2 成功
  剩余 ${registry.patchTargets ? Object.values(registry.patchTargets).filter(v => Array.isArray(v?.actions)).length : 0} 个混淆文件需手工修改
  新文件: 7 个已就绪
═══════════════════════════════════════════════════════════════
`);
