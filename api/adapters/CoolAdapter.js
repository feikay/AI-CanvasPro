/**
 * CoolAdapter - COOL API 网关适配器 (MJ API)
 * 
 * 协议: 自定义异步 submit/poll 模式
 * Base URL: https://api.mjapi.cc.cd
 * 
 * 流程: POST /v1/cool/generate → GET /v1/cool/task/{task_id} (轮询)
 * 
 * @see docs/COOL_API_DOC.md
 * @see docs/MJ_API_模型列表.md
 */

/**
 * 模型 key 映射: cool/xxx → COOL API 模型名
 */
const COOL_MODEL_MAP = {
  // 图片模型
  'cool/flux_kontext_pro':      'flux_kontext_pro',
  'cool/gpt_image_2':           'gpt_image_2',
  'cool/gpt_image_2_4k':        'gpt_image_2_4k',
  'cool/midjourney_v7':         'midjourney_v7',
  'cool/nano_banana_2':         'nano_banana_2',
  'cool/nano_banana_2_4k':      'nano_banana_2_4k',
  'cool/nano_banana_pro':       'nano_banana_pro',
  'cool/nano_banana_pro_4k':    'nano_banana_pro_4k',
  'cool/omnihuman_1_5':         'omnihuman_1_5',
  'cool/seedream_4_5':          'seedream_4_5',
  // 视频模型
  'cool/grok_imagine_video':    'grok_imagine_video',
  'cool/happyhorse_1':          'happyhorse_1',
  'cool/kling_3_audio':         'kling_3_audio',
  'cool/kling_3_omni':          'kling_3_omni',
  'cool/kling_3_silent':        'kling_3_silent',
  'cool/seedance_1_5_pro_audio':   'seedance_1_5_pro_audio',
  'cool/seedance_1_5_pro_silent':  'seedance_1_5_pro_silent',
  'cool/seedance_2':            'seedance_2',
  'cool/seedance_2_1080p':      'seedance_2_1080p',
  'cool/seedance_2_1080p_video':'seedance_2_1080p_video',
  'cool/seedance_2_480p':       'seedance_2_480p',
  'cool/seedance_2_480p_video': 'seedance_2_480p_video',
  'cool/seedance_2_720p':       'seedance_2_720p',
  'cool/seedance_2_720p_video': 'seedance_2_720p_video',
  'cool/seedance_2_fast':       'seedance_2_fast',
  'cool/seedance_2_fast_480p':  'seedance_2_fast_480p',
  'cool/seedance_2_fast_480p_video': 'seedance_2_fast_480p_video',
  'cool/seedance_2_fast_720p':  'seedance_2_fast_720p',
  'cool/seedance_2_fast_720p_video': 'seedance_2_fast_720p_video',
  'cool/sora_2':                'sora_2',
  'cool/veo_3_1_fast':          'veo_3_1_fast',
  'cool/vidu_q2_pro':           'vidu_q2_pro',
  'cool/vidu_q3':               'vidu_q3',
  'cool/vidu_q3_pro':           'vidu_q3_pro',
  'cool/wan_2_6':               'wan_2_6',
};

/**
 * 视频模型集合 — 用于判断模型类型
 */
const VIDEO_MODELS = new Set([
  'grok_imagine_video', 'happyhorse_1',
  'kling_3_audio', 'kling_3_omni', 'kling_3_silent',
  'seedance_1_5_pro_audio', 'seedance_1_5_pro_silent',
  'seedance_2', 'seedance_2_1080p', 'seedance_2_1080p_video',
  'seedance_2_480p', 'seedance_2_480p_video',
  'seedance_2_720p', 'seedance_2_720p_video',
  'seedance_2_fast', 'seedance_2_fast_480p', 'seedance_2_fast_480p_video',
  'seedance_2_fast_720p', 'seedance_2_fast_720p_video',
  'sora_2', 'veo_3_1_fast',
  'vidu_q2_pro', 'vidu_q3', 'vidu_q3_pro',
  'wan_2_6',
]);

/**
 * 将 cool/xxx 模型名转换为 COOL API 模型 key
 */
function mapCoolModel(modelId) {
  const key = String(modelId || '').trim();
  return COOL_MODEL_MAP[key] || key.replace(/^cool\//, '');
}

/**
 * 判断是否为视频模型
 */
function isCoolVideoModel(modelId) {
  const apiModel = mapCoolModel(modelId);
  return VIDEO_MODELS.has(apiModel);
}

/**
 * 构建 files 数组 — 参考图片/视频
 * COOL API 支持 @图片1, @图片2 隐式别名，无需显式 name
 */
function buildFilesArray(inputUrls, modelId) {
  if (!Array.isArray(inputUrls) || inputUrls.length === 0) return [];

  const isVideoModel = isCoolVideoModel(modelId);
  return inputUrls
    .filter(url => String(url || '').trim())
    .map(url => ({
      url: String(url).trim(),
      type: isVideoModel ? 'image' : 'image',
    }));
}

/**
 * 解析宽高比 — 确保是 COOL 支持的格式
 */
function normalizeRatio(ratio) {
  const r = String(ratio || '16:9').trim();
  // 自适应/auto → 16:9
  if (!r.includes(':') || r === '自适应' || r.toLowerCase() === 'auto') {
    return '16:9';
  }
  return r;
}

/**
 * 规范化视频分辨率
 */
function normalizeResolution(resolution, modelId) {
  if (isCoolVideoModel(modelId)) {
    // 视频模型: 480p/720p/1080p
    const r = String(resolution || '720p').trim().toLowerCase();
    if (['480p', '720p', '1080p'].includes(r)) return r;
    return '720p';
  }
  // 图片模型: 2K/4K
  const r = String(resolution || '2K').trim().toUpperCase();
  if (['1K', '2K', '4K'].includes(r)) return r;
  return '2K';
}

/**
 * 构建 COOL submit 请求
 */
function buildCoolSubmitRequest(payload, prompt, ctx) {
  const config = ctx.getProviderConfig('cool');
  // COOL API Base URL 固定不可变，强制使用正确值，忽略用户可能保存的旧错误配置
  const apiUrl = 'https://api.mjapi.cc.cd';
  const apiKey = config.apiKey || '';

  if (!apiKey) {
    throw new Error('API Key 未配置（厂商：COOL），无法发起请求');
  }

  const coolModel = mapCoolModel(payload.model);
  const isVideo = isCoolVideoModel(payload.model);

  const body = {
    apiUrl: apiUrl + '/v1/cool/generate',
    apiKey: apiKey,
    prompt: String(prompt || '').trim(),
    model: coolModel,
    ratio: normalizeRatio(payload.aspectRatio || payload.resolvedRatioLabel),
    resolution: normalizeResolution(payload.resolution || payload.imageSize, payload.model),
  };

  // 视频模型可传 duration
  if (isVideo && payload.duration) {
    body.duration = Math.max(1, Math.min(15, Number(payload.duration) || 5));
  }

  // 参考图
  const inputUrls = Array.isArray(payload.inputUrls) ? payload.inputUrls : [];
  const additionalImages = Array.isArray(payload.images) ? payload.images : [];
  const allUrls = [...inputUrls, ...additionalImages].filter(Boolean);
  const files = buildFilesArray(allUrls, payload.model);
  if (files.length > 0) {
    body.files = files;
  }

  // timeout: 图片5分钟, 视频30分钟
  body.timeout = isVideo ? 1800 : 300;

  return {
    url: '/api/v2/proxy/cool',
    headers: { 'Content-Type': 'application/json' },
    body: body,
    isAsync: true,
    taskIdPath: 'task_id',
    pollUrlBuilder: (taskId) => {
      return '/api/v2/proxy/cool?apiUrl=' +
        encodeURIComponent(apiUrl + '/v1/cool/task/' + encodeURIComponent(taskId));
    },
    resultExtractor: (pollResult) => {
      if (!pollResult) return [];
      // status: pending / running / success / failed
      if (pollResult.status === 'success') {
        if (pollResult.result && pollResult.result.url) {
          return [pollResult.result.url];
        }
        // 有些响应可能直接在 result.url
        return [];
      }
      if (pollResult.status === 'failed') {
        throw new Error(pollResult.error || 'COOL 任务生成失败');
      }
      // pending / running — 继续等待
      return [];
    },
    adapterTrace: {
      source: 'cool-adapter',
      modelId: payload.model,
      coolModel: coolModel,
    },
  };
}

/**
 * 构建图片生成请求
 * COOL 图片和视频都走同一个 /v1/cool/generate 接口
 */
export async function buildImageRequest(payload, prompt, ctx) {
  if (!payload.model) {
    throw new Error('未指定模型，无法发起 COOL 图像生成请求');
  }
  return buildCoolSubmitRequest(payload, prompt, ctx);
}

/**
 * 构建视频生成请求
 */
export async function buildVideoRequest(payload, prompt, ctx) {
  if (!payload.model) {
    throw new Error('未指定模型，无法发起 COOL 视频生成请求');
  }
  return buildCoolSubmitRequest(payload, prompt, ctx);
}

/**
 * 连接测试 — 轻量级验证
 * 用于 providerConnectionTestApi.js 中调用
 */
export async function testCoolConnection(providerConfig) {
  const apiUrl = (providerConfig.apiUrl || 'https://api.mjapi.cc.cd').replace(/\/+$/, '');
  const apiKey = String(providerConfig.apiKey || '').trim();

  if (!apiKey) {
    return { ok: false, error: 'API Key 未填写', category: 'missing_key' };
  }

  // 使用 /v1/cool/models 验证连通性
  const modelsUrl = apiUrl + '/v1/cool/models';

  return {
    step: 'auth',
    apiUrl: modelsUrl,
    apiKey: apiKey,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
    },
    // 期望: HTTP 200 + 返回模型列表
    validate: (response) => {
      return response && (Array.isArray(response) || response.models);
    },
  };
}
