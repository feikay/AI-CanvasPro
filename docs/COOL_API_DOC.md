# Cool API 网关接口文档

> **Base URL**: `https://api.mjapi.cc.cd`
> **版本**: v1
> **更新日期**: 2026-05-01

---

## 认证方式

所有接口均需认证，支持以下三种方式（任选其一）：

| 方式 | Header | 示例 |
|------|--------|------|
| Bearer Token | `Authorization: Bearer <key>` | `Bearer sk-xxxx` 或 `Bearer your-api-key` |
| X-API-Key | `X-API-Key: <key>` | `X-API-Key: your-api-key` |
| Basic Auth | `Authorization: Basic <base64>` | `Basic dXNlcjprZXk=` (密码为您的 API Key) |

**商业化接入**：使用 `sk-` 前缀的 Token 会触发数据库验资和自动扣费/退费机制。

## 计费与退款机制 (重要)

Cool API 采用 **按次计费，失败全退** 的企业级计费安全机制：

1. **动态计费模式**：系统支持「按次计费」和「按秒计费」双重模式。传统图片/视频模型按“次”定额计费，而新一代视频模型（如 Seedance 2.0 官方直连接口）支持**精确到秒**的按秒计费，且根据请求的 `resolution`（画质）和是否带视频参考，单价会有所不同。
2. **预扣机制**：提交任务时，网关会根据计费模式预先扣除该次调用的总额度（或基于时长的总额度）。
3. **失败全退**：如果任务生成失败、排队超时或由于安全原因被拒绝，系统会在毫秒级将预扣额度全额原路退还。

> **提示**：所有消费和退款的明细均可在 NewAPI 的消费日志中查阅，日志中会精确注明模型名称及相应的退款原因。

---

## 接口总览

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/v1/cool/generate` | 提交生成任务（图片/视频，支持参考文件） |
| `GET` | `/v1/cool/task/{task_id}` | 查询单个任务状态与结果 |
| `GET` | `/v1/cool/tasks` | 查看所有任务 |
| `POST` | `/v1/cool/upload_url` | 通过外部 URL 上传参考文件到 Cool CDN |
| `GET` | `/v1/cool/models` | 查看可用模型列表 |
| `GET` | `/v1/cool/pool` | 查看账号池状态 |

---

## 1. 提交生成任务

### `POST /v1/cool/generate`

提交一个异步生成任务，返回 `task_id`，通过轮询获取结果。

### 请求体 (JSON)

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `prompt` | string | ✅ | - | 生成描述/提示词 |
| `model` | string | ❌ | `"gpt_image_2"` | 模型 key，见下方模型表 |
| `ratio` | string | ❌ | `"16:9"` | 宽高比，如 `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"` |
| `duration` | int | ❌ | `5` | 视频期望生成时长（秒），用于传递给模型参考。若模型为按秒计费，则影响总价格 |
| `resolution` | string | ❌ | 视模型而定 | 分辨率（按模型类型区分）。**视频模型**（Seedance 等）支持 `"480p"`, `"720p"`, `"1080p"`；**图片模型**（GPT Image 2 等）支持 `"2K"`（默认）, `"4K"`。两类分辨率不可混用 |
| `timeout` | int | ❌ | 按模型自动 | 超时秒数，超过则返回失败 |
| `files` | array | ❌ | `null` | 参考文件列表（图片/视频/音频），见下方说明 |

### `files` 数组元素

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `url` | string | ✅ | - | 文件 URL（外部链接或已上传的 Cool CDN 链接） |
| `type` | string | ❌ | `"image"` | 文件类型：`image` / `video` / `audio` |
| `name` | string | ❌ | 自动生成 | 文件名（含扩展名，如 `ref.png`） |

> **说明**：如果 `url` 不是 Cool CDN 链接（非 `https://cdn-ap.cool.tv` 开头），网关会**自动下载并代为上传**到 Cool CDN。

### 请求示例

**纯文本生成（无参考图）**：
```bash
curl -X POST https://api.mjapi.cc.cd/v1/cool/generate \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一只橘猫在阳光下打盹",
    "model": "seedance_2_fast",
    "ratio": "16:9",
    "duration": 5
  }'
```

**带参考图生成视频**：
```bash
curl -X POST https://api.mjapi.cc.cd/v1/cool/generate \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "参考这张图片的构图和色调，生成一段5秒的视频",
    "model": "seedance_2_fast",
    "ratio": "16:9",
    "files": [
      {
        "url": "https://example.com/my-reference-image.jpg",
        "type": "image"
      }
    ]
  }'
```

**多参考图生成**：
```bash
curl -X POST https://api.mjapi.cc.cd/v1/cool/generate \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "根据首帧和尾帧的画面，生成平滑过渡的视频",
    "model": "seedance_2",
    "files": [
      {"url": "https://example.com/first-frame.jpg", "type": "image", "name": "首帧.jpg"},
      {"url": "https://example.com/last-frame.jpg", "type": "image", "name": "尾帧.jpg"}
    ]
  }'
```

**高级用法：精准图文混排（@文件名）**：
如果你上传了多个参考文件，并且希望在提示词的特定位置引用它们，可以在 `files` 数组中指明 `name` 字段，然后在 `prompt` 中使用 `@文件名` 语法进行精准引用。

> **🌟 新特性（智能降级匹配 & 自动纠错 & 隐式映射）**：
> 1. **隐式自动别名（强烈推荐）**：无需在代码里繁琐地为文件定义 `name`，系统会根据数组传入顺序自动生成内置别名。您可以直接在提示词中写 `@图片1`、`@图片2`（以此类推，视频为 `@视频1`，音频为 `@音频1`）。例如：`@图片1是李强，@图片2是张三，李强和张三在打架。` 系统会自动将请求数组中第1张和第2张图片精准映射上去，实现零侵入无缝开发兼容！
> 2. **API 传参可无后缀**：若您选择自定义名称，`files` 数组里的 `name` 字段**可以直接传无后缀的名称**（例如 `"name": "图1"`），底层会自动补全后缀。
> 3. **提示词可无后缀**：在提示词中书写自定义名称时，**可以省略后缀名**。写 `@图1` 也能完美对接。

**隐式别名自动映射示例（极简接入）**：
```bash
curl -X POST https://api.mjapi.cc.cd/v1/cool/generate \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "@图片1是李强，@图片2是张三，李强和张三在打架",
    "model": "seedance_2",
    "files": [
      {"url": "https://example.com/liqiang.jpg", "type": "image"},
      {"url": "https://example.com/zhangsan.jpg", "type": "image"}
    ]
  }'
```
*(注意：如上所示，完全不需要传入 name 字段，系统会自动将数组第 1 个图片映射为 @图片1)*

**自定义名称映射示例（高级用法）**：
```bash
curl -X POST https://api.mjapi.cc.cd/v1/cool/generate \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "首帧使用 @start，尾帧使用 @end，中间产生平滑变幻的动画效果",
    "model": "seedance_2",
    "files": [
      {"url": "https://example.com/1.jpg", "name": "start"},
      {"url": "https://example.com/2.jpg", "name": "end"}
    ]
  }'
```
> **提示**：如果不在 `prompt` 中显式写 `@文件名` 或匹配失败，网关会自动把所有参考文件默认堆叠到提示词的最前面，但这可能导致模型无法将特定图片与文本指令对齐（即“没吃上参考”）。

### 响应示例

```json
{
  "task_id": "a1b2c3d4",
  "status": "pending",
  "message": "任务已提交，使用模型 Seedance 2.0 - Fast",
  "poll_url": "/v1/cool/task/a1b2c3d4"
}
```

### 错误码

| HTTP Code | 说明 |
|-----------|------|
| 400 | 未知模型 key |
| 402 | 余额不足（`sk-` Token 验资失败） |
| 503 | 服务器繁忙（达到 1500 并发上限）或无可用账号 |

---

## 2. 查询任务结果

### `GET /v1/cool/task/{task_id}`

轮询指定任务的状态和结果。**建议每 3-5 秒轮询一次。**

### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `task_id` | string | 提交任务时返回的 task_id |

### 响应字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `task_id` | string | 任务 ID |
| `status` | string | `pending` / `running` / `success` / `failed` |
| `model` | string | 模型 key |
| `model_display` | string | 模型显示名 |
| `media_type` | string | `image` / `video` |
| `prompt` | string | 用户原始提示词 |
| `ratio` | string | 宽高比 |
| `result` | object\|null | 生成结果（仅 `success` 时有值），详见下方 |
| `error` | string\|null | 错误信息（仅 `failed` 时有值） |
| `created_at` | string | 任务创建时间 (ISO 8601) |
| `completed_at` | string\|null | 任务完成时间 (ISO 8601) |

### `result` 对象字段（status=success 时）

**核心字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `url` | string | ⭐ **主文件下载链接**（图片或视频 CDN 地址） |
| `media_type` | string | `image` / `video` |
| `resource_id` | string | Cool 资源 ID |
| `model` | string | 模型显示名 |
| `prompt` | string | 用户原始提示词 |
| `ratio` | string | 请求的宽高比 |

**视频专属字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `duration` | float\|null | 视频时长（秒），图片为 null |
| `resolution` | string\|null | 分辨率，如 `"720p"` 或 `"4K"` |
| `transcoder_url` | string\|null | 转码版视频地址（低码率） |

**通用元数据**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `aspect_ratio` | string\|null | 实际宽高比 |
| `credits_info` | object\|null | 积分消耗详情 `{init_revenue, revenue}` |
| `model_type` | int\|null | 模型编号 |
| `actual_prompt` | string\|null | Cool Agent 改写后的实际英文提示词 |
| `name` | string\|null | Cool 自动生成的资源名称 |
| `thumbnail_url` | string\|null | 缩略图地址 |
| `standard_url` | object\|null | 多尺寸封面图 `{small, medium, large, compressed}` |
| `file_size` | int\|null | 文件大小（字节） |
| `watermark_status` | int\|null | 水印状态 |
| `watermark_url` | string\|null | 带水印版地址 |
| `created_at` | string\|null | 资源创建时间 |
| `updated_at` | string\|null | 资源更新时间 |

**引用信息**（参考图/视频生成时）：

| 字段 | 类型 | 说明 |
|------|------|------|
| `ref_image_id` | string\|null | 参考图片 ID |
| `ref_image_id_list` | array\|null | 参考图片 ID 列表 |
| `ref_image_tail_id` | string\|null | 尾帧参考图 ID |
| `ref_video_info` | object\|null | 参考视频信息 |
| `ref_audio_info` | object\|null | 参考音频信息 |
| `audio_id` | string\|null | 音频资源 ID |
| `audio_params` | object\|null | 音频参数 |

### 成功响应示例

```json
{
  "task_id": "a1b2c3d4",
  "status": "success",
  "model": "seedance_2_fast",
  "model_display": "Seedance 2.0 - Fast",
  "media_type": "video",
  "prompt": "一只橘猫在阳光下打盹",
  "ratio": "16:9",
  "result": {
    "url": "https://cdn-ap.cool.tv/videos/abc123.mp4?auth_key=...",
    "media_type": "video",
    "resource_id": "6e13d498e6f84f5aac42d1d12a83149f",
    "model": "Seedance 2.0 - Fast",
    "prompt": "一只橘猫在阳光下打盹",
    "ratio": "16:9",
    "duration": 5.0,
    "resolution": "720p",
    "aspect_ratio": "16:9",
    "credits_info": {"init_revenue": 30.0, "revenue": 30.0},
    "model_type": 20018,
    "actual_prompt": "A ginger cat napping in warm sunlight...",
    "name": "Ginger Cat Nap",
    "thumbnail_url": "https://cdn-ap.cool.tv/thumbnails/abc123.jpg",
    "transcoder_url": "https://cdn-ap.cool.tv/videos/abc123_tc.mp4",
    "standard_url": {
      "small": "https://...",
      "medium": "https://...",
      "large": "https://...",
      "compressed": "https://..."
    },
    "file_size": 3145728,
    "ref_image_id": null,
    "ref_image_id_list": null,
    "ref_image_tail_id": null,
    "ref_video_info": null,
    "ref_audio_info": null,
    "audio_id": null,
    "audio_params": null,
    "watermark_status": 0,
    "watermark_url": null,
    "status": "completed",
    "created_at": "2026-04-30T08:00:14+00:00",
    "updated_at": "2026-04-30T08:03:22+00:00"
  },
  "error": null,
  "created_at": "2026-04-30T16:00:14.493173",
  "completed_at": "2026-04-30T16:03:22.812456"
}
```

### 轮询代码示例 (Python)

```python
import requests, time

API = "https://api.mjapi.cc.cd"
HEADERS = {"Authorization": "Bearer sk-xxx"}

# 1. 提交任务
resp = requests.post(f"{API}/v1/cool/generate", headers=HEADERS, json={
    "prompt": "一只橘猫在阳光下打盹",
    "model": "seedance_2_fast",
    "files": [{"url": "https://example.com/cat.jpg", "type": "image"}]
})
task_id = resp.json()["task_id"]
print(f"任务已提交: {task_id}")

# 2. 轮询结果
while True:
    r = requests.get(f"{API}/v1/cool/task/{task_id}", headers=HEADERS).json()
    print(f"状态: {r['status']}")
    if r["status"] == "success":
        print(f"✅ 下载链接: {r['result']['url']}")
        break
    elif r["status"] == "failed":
        print(f"❌ 失败: {r['error']}")
        break
    time.sleep(5)
```

---

## 3. 查看所有任务

### `GET /v1/cool/tasks`

返回最近 100 条任务记录（已完成超过 2 小时的会自动清理）。任务状态持久化在数据库中，服务重启不丢失。

### 响应

返回数组，每个元素结构同 `/v1/cool/task/{task_id}` 的响应。

---

## 4. 上传参考文件

### `POST /v1/cool/upload_url`

通过外部 URL 将文件上传到 Cool CDN。返回的 `file_url` 可在后续 generate 请求的 `files` 中复用。

> **注意**：大多数情况下**不需要单独调用此接口**。在 `/v1/cool/generate` 中直接传外部 URL，网关会自动代为上传。此接口适用于**预上传**或**同一文件多次复用**的场景。

### 请求体 (JSON)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | string | ✅ | 外部图片/视频/音频 URL |
| `filename` | string | ❌ | 文件名（可选，自动从 URL 推断） |

### 请求示例

```bash
curl -X POST https://api.mjapi.cc.cd/v1/cool/upload_url \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/my-reference.jpg"
  }'
```

### 响应示例

```json
{
  "file_url": "https://cdn-ap.cool.tv/images/70eb47cfb063.png?auth_key=1780127304-0-0-36a453...",
  "file_type": "image",
  "file_name": "my-reference.jpg"
}
```

### 复用上传结果

```bash
curl -X POST https://api.mjapi.cc.cd/v1/cool/generate \
  -H "Authorization: Bearer sk-xxx" \
  -d '{
    "prompt": "参考图片生成视频",
    "model": "seedance_2_fast",
    "files": [
      {"url": "https://cdn-ap.cool.tv/images/70eb47cfb063.png?auth_key=...", "type": "image"}
    ]
  }'
```

---

## 5. 上传本地文件

### `POST /v1/cool/upload`

上传本地图片/视频文件到 CDN（`multipart/form-data`）。

### 请求

```bash
curl -X POST https://api.mjapi.cc.cd/v1/cool/upload \
  -H "Authorization: Bearer sk-xxx" \
  -F "file=@/path/to/my-image.jpg"
```

### 响应示例

```json
{
  "file_url": "https://cdn-ap.flova.tv/images/abc123.png?auth_key=...",
  "file_type": "image",
  "file_name": "my-image.jpg"
}
```

---

## 6. 查看可用模型

### `GET /v1/cool/models`

### 模型速查表

**图片模型**（按张计费）：

| Key | 模型名 | 默认超时 | 说明 |
|-----|--------|----------|------|
| `gpt_image_2` | GPT Image 2 | 5 分钟 | OpenAI 图像生成 |
| `seedream_4_5` | Seedream 4.5 | 5 分钟 | 字节跳动图像模型 |
| `midjourney_v7` | Midjourney V7 | 10 分钟 | MJ 最新版，耗时较长 |
| `flux_kontext_pro` | Flux.1 Kontext Pro | 5 分钟 | Black Forest Labs |
| `nano_banana_2` | Nano Banana 2 | 5 分钟 | 快速图像生成 |
| `nano_banana_pro` | Nano Banana Pro | 5 分钟 | 高质量图像 |

**视频模型**（按次计费，单次生成定额扣费）：

| Key | 模型名 | 默认超时 | 说明 |
|-----|--------|----------|------|
| `seedance_2` | Seedance 2.0 | 30 分钟 | 高质量视频，较慢 |
| `seedance_2_fast` | Seedance 2.0 - Fast | 20 分钟 | ⭐ 快速视频（推荐入门） |
| `seedance_1_5_pro_audio` | Seedance 1.5 Pro Audio | 30 分钟 | 带音频生成 |
| `seedance_1_5_pro_silent` | Seedance 1.5 Pro Silent | 30 分钟 | 无音频版 |
| `happyhorse_1` | HappyHorse 1.0 | 30 分钟 | HappyHorse 视频 |
| `kling_3_silent` | Kling 3.0 Silent | 30 分钟 | 快手视频（静音） |
| `kling_3_omni` | Kling 3.0 Omni | 30 分钟 | 快手全能版 |
| `kling_3_audio` | Kling 3.0 Audio | 30 分钟 | 快手视频（带音频） |
| `vidu_q3` | Vidu Q3 | 30 分钟 | Vidu Q3 |
| `vidu_q2_pro` | Vidu Q2 Pro | 30 分钟 | Vidu Q2 专业版 |
| `vidu_q3_pro` | Vidu Q3 Pro | 30 分钟 | Vidu Q3 专业版 |
| `grok_imagine_video` | Grok Imagine Video | 30 分钟 | xAI Grok 视频 |
| `sora_2` | Sora 2 | 30 分钟 | OpenAI Sora 2 |
| `wan_2_6` | Wan 2.6 | 30 分钟 | 阿里万相 2.6 |
| `veo_3_1_fast` | Veo 3.1-Fast | 30 分钟 | Google Veo 快速版 |
| `omnihuman_1_5` | OmniHuman 1.5 | 30 分钟 | OmniHuman 数字人 |

---

## 7. 计费机制

使用 `sk-` 前缀 Token 调用时：

1. **自动扣费**：根据模型定价自动从余额预扣，图片和视频均按次定额计费。
2. **成功生效**：任务 `success` 时扣费生效。
3. **全自动退款**：任务 `failed` 或超时，**全自动退还**所有预扣额度。
4. **服务重启保障**：任务状态持久化在数据库中。即使服务器重启，中断的任务也会自动标记失败并退款，保障零客诉。

---

## 并发限制

| 限制项 | 值 |
|--------|-----|
| 最大并发生成任务 | 1500 |
| 任务记录保留时间 | 2 小时（数据库存储，重启不丢失） |
| 超出并发上限 | 立即返回 503，不排队 |
| 视频最大时长 | 15 秒 |

---

## 完整调用流程

```
┌─────────────┐       POST /generate        ┌──────────────┐
│   客户端     │ ──────────────────────────▶ │   API 网关    │
│             │ ◀────── task_id ──────────── │              │
│             │                              │  1. 权限验证  │
│             │       GET /task/{id}         │  2. 提交生成  │
│             │ ──────────────────────────▶ │  3. 轮询结果  │
│             │ ◀────── status:running ───── │              │
│             │                              │              │
│             │       GET /task/{id}         │              │
│             │ ──────────────────────────▶ │              │
│             │ ◀────── status:success ───── │              │
│             │         result.url           │              │
└─────────────┘                              └──────────────┘
```
