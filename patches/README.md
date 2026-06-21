# COOL (MJ API) 厂商接入补丁包

> **策略 B — 维护补丁集**
> 
> 此目录包含将 COOL API 网关接入 AI-CanvasPro 所需的全部文件和指引。

## 目录结构

```
patches/
├── vendor-registry.json          # 声明式厂商配置（补丁核心定义）
├── apply-patches.js              # 自动注入脚本（处理非混淆文件）
├── templates/
│   ├── cool-api-card.html        # API Key 卡片 HTML 模板
│   └── cool-proxy-routes.py      # 后端代理路由模板
└── README.md                     # 本文件
```

## 已创建的新文件（零冲突）

| 文件 | 说明 |
|------|------|
| `api/adapters/CoolAdapter.js` | COOL 适配器，处理 submit/poll 请求 |
| `api/errors/parsers/CoolErrorParser.js` | COOL 错误解析器 |
| `src/manifests/image/modelApi/coolImageManifests.js` | 10个图片模型清单 |
| `src/manifests/video/modelApi/coolVideoManifests.js` | 25个视频模型清单 |

这些文件是纯新建的，与现有代码无冲突，upstream 更新不会影响。

## 使用方法

### 首次接入

```bash
# 1. 预览改动（安全，不实际修改）
node patches/apply-patches.js --dry-run

# 2. 执行注入（自动修改 index.html 和 server.py）
node patches/apply-patches.js

# 3. 手工修改混淆 JS 文件（8个）
#    按照终端输出的指引，逐个打开文件手动修改
#    参考 vendor-registry.json 的 patchTargets 部分
```

### Upstream 更新后

```bash
# 每次 upstream 发布新版本后:
git pull upstream main

# 重新运行补丁脚本
node patches/apply-patches.js

# 重新手工修改混淆文件（按脚本输出指引）
```

## 混淆文件改动清单

按 `vendor-registry.json` → `patchTargets` 中的说明，需要修改以下 **15 个文件**：

1. **`src/modules/providers.js`** — 添加 `cool` 到 `PROVIDERS_META`
2. **`api/configApi.js`** — 添加 `cool` 到 `DEFAULT_SECURE_PROVIDER_IDS`
3. **`api/providerConnectionTestApi.js`** — 添加 cool 连接测试函数
4. **`src/manifests/modelRegistry.js`** — 注册 cool 前缀 + 导入注册清单
5. **`src/manifests/image/modelApi/index.js`** — 导出 cool 图片清单 + **聚合数组加 cool**
6. **`src/manifests/video/modelApi/vendorVideoModelApiManifests.js`** — 导入 cool 视频清单 + **聚合数组加 cool**
7. **`api/adapters/ModelApiManifestNormalizer.js`** — 注册 `coolGenerate` bodyResolver
8. **`src/modules/app/appTopbarAndConfig.js`** — 绑定 COOL 设置面板事件（API Key 收集数组加 `cool`）
9. **`src/modules/imageFunctionModelMenu.js`** — 图片功能节点菜单加 COOL 厂商
10. **`src/components/aigenImage/uiModuleModelHelpers.js`** — AI 生图节点菜单加 COOL 分组
11. **`src/components/video-node/parameterPanelModelHelpers.js`** — 新增 COOL 视频菜单辅助函数
12. **`src/components/video-node/parameterPanelModule.js`** — AI 视频节点菜单加 COOL 分组
13. **`src/manifests/image/modelApi/index.js`** — （同 #5，re-export 改 import+export）
14. **`src/manifests/video/modelApi/vendorVideoModelApiManifests.js`** — （同 #6）
15. **`src/manifests/video/modelApi/coolVideoManifests.js`** — **修复 cool 视频 kind 为 'video'**

> **注意**：第 5、6 项是之前遗漏的关键修复——聚合数组不包含 cool 导致 `getModelsByKind()` 查不到模型，菜单展开后为空。第 15 项修复 `createImageModelApiManifest` 硬编码 `kind:'image'` 导致 cool 视频模型被 `getModelsByKind('video')` 遗漏的问题。

## COOL API 概要

| 项目 | 说明 |
|------|------|
| Base URL | `https://api.mjapi.cc.cd` |
| 认证 | `Authorization: Bearer sk-xxx` |
| 协议 | 自定义 submit/poll 异步模式 |
| 图片模型 | 10 个 (Flux, GPT Image, Midjourney, Nano Banana, Omnihuman, Seedream) |
| 视频模型 | 25 个 (Seedance 2 系列 12变体, Seedance 2 Fast 5变体, Kling, Sora, Vidu 等) |
| 参考文档 | `docs/COOL_API_DOC.md` / `docs/MJ_API_模型列表.md` |
