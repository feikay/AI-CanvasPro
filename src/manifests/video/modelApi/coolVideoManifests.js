/**
 * COOL 视频模型清单 (MJ API)
 * 共 25 个视频模型（含 Seedance 2 多分辨率变体）
 * 
 * 采用 modelApi 适配器类型，通过 bodyResolver='coolGenerate' 委托给 CoolAdapter 构建请求
 */

import {
  createImageModelApiManifest,
  createModelApiExecutionManifest,
} from '../../image/modelApi/sharedImageModelApiFields.js';

// ---- Model IDs ----
export const COOL_GROK_IMAGINE_VIDEO_MODEL_ID = 'cool/grok_imagine_video';
export const COOL_HAPPYHORSE_1_MODEL_ID = 'cool/happyhorse_1';
export const COOL_KLING_3_AUDIO_MODEL_ID = 'cool/kling_3_audio';
export const COOL_KLING_3_OMNI_MODEL_ID = 'cool/kling_3_omni';
export const COOL_KLING_3_SILENT_MODEL_ID = 'cool/kling_3_silent';
export const COOL_SEEDANCE_1_5_PRO_AUDIO_MODEL_ID = 'cool/seedance_1_5_pro_audio';
export const COOL_SEEDANCE_1_5_PRO_SILENT_MODEL_ID = 'cool/seedance_1_5_pro_silent';
export const COOL_SEEDANCE_2_MODEL_ID = 'cool/seedance_2';
export const COOL_SEEDANCE_2_1080P_MODEL_ID = 'cool/seedance_2_1080p';
export const COOL_SEEDANCE_2_1080P_VIDEO_MODEL_ID = 'cool/seedance_2_1080p_video';
export const COOL_SEEDANCE_2_480P_MODEL_ID = 'cool/seedance_2_480p';
export const COOL_SEEDANCE_2_480P_VIDEO_MODEL_ID = 'cool/seedance_2_480p_video';
export const COOL_SEEDANCE_2_720P_MODEL_ID = 'cool/seedance_2_720p';
export const COOL_SEEDANCE_2_720P_VIDEO_MODEL_ID = 'cool/seedance_2_720p_video';
export const COOL_SEEDANCE_2_FAST_MODEL_ID = 'cool/seedance_2_fast';
export const COOL_SEEDANCE_2_FAST_480P_MODEL_ID = 'cool/seedance_2_fast_480p';
export const COOL_SEEDANCE_2_FAST_480P_VIDEO_MODEL_ID = 'cool/seedance_2_fast_480p_video';
export const COOL_SEEDANCE_2_FAST_720P_MODEL_ID = 'cool/seedance_2_fast_720p';
export const COOL_SEEDANCE_2_FAST_720P_VIDEO_MODEL_ID = 'cool/seedance_2_fast_720p_video';
export const COOL_SORA_2_MODEL_ID = 'cool/sora_2';
export const COOL_VEO_3_1_FAST_MODEL_ID = 'cool/veo_3_1_fast';
export const COOL_VIDU_Q2_PRO_MODEL_ID = 'cool/vidu_q2_pro';
export const COOL_VIDU_Q3_MODEL_ID = 'cool/vidu_q3';
export const COOL_VIDU_Q3_PRO_MODEL_ID = 'cool/vidu_q3_pro';
export const COOL_WAN_2_6_MODEL_ID = 'cool/wan_2_6';

// ---- Execution IDs ----
export const COOL_GROK_IMAGINE_VIDEO_EXECUTION_ID = 'cool.model-api.grok-imagine.v1';
export const COOL_HAPPYHORSE_1_EXECUTION_ID = 'cool.model-api.happyhorse-1.v1';
export const COOL_KLING_3_AUDIO_EXECUTION_ID = 'cool.model-api.kling-3-audio.v1';
export const COOL_KLING_3_OMNI_EXECUTION_ID = 'cool.model-api.kling-3-omni.v1';
export const COOL_KLING_3_SILENT_EXECUTION_ID = 'cool.model-api.kling-3-silent.v1';
export const COOL_SEEDANCE_1_5_PRO_AUDIO_EXECUTION_ID = 'cool.model-api.seedance-15-pro-audio.v1';
export const COOL_SEEDANCE_1_5_PRO_SILENT_EXECUTION_ID = 'cool.model-api.seedance-15-pro-silent.v1';
export const COOL_SEEDANCE_2_EXECUTION_ID = 'cool.model-api.seedance-2.v1';
export const COOL_SEEDANCE_2_1080P_EXECUTION_ID = 'cool.model-api.seedance-2-1080p.v1';
export const COOL_SEEDANCE_2_1080P_VIDEO_EXECUTION_ID = 'cool.model-api.seedance-2-1080p-video.v1';
export const COOL_SEEDANCE_2_480P_EXECUTION_ID = 'cool.model-api.seedance-2-480p.v1';
export const COOL_SEEDANCE_2_480P_VIDEO_EXECUTION_ID = 'cool.model-api.seedance-2-480p-video.v1';
export const COOL_SEEDANCE_2_720P_EXECUTION_ID = 'cool.model-api.seedance-2-720p.v1';
export const COOL_SEEDANCE_2_720P_VIDEO_EXECUTION_ID = 'cool.model-api.seedance-2-720p-video.v1';
export const COOL_SEEDANCE_2_FAST_EXECUTION_ID = 'cool.model-api.seedance-2-fast.v1';
export const COOL_SEEDANCE_2_FAST_480P_EXECUTION_ID = 'cool.model-api.seedance-2-fast-480p.v1';
export const COOL_SEEDANCE_2_FAST_480P_VIDEO_EXECUTION_ID = 'cool.model-api.seedance-2-fast-480p-video.v1';
export const COOL_SEEDANCE_2_FAST_720P_EXECUTION_ID = 'cool.model-api.seedance-2-fast-720p.v1';
export const COOL_SEEDANCE_2_FAST_720P_VIDEO_EXECUTION_ID = 'cool.model-api.seedance-2-fast-720p-video.v1';
export const COOL_SORA_2_EXECUTION_ID = 'cool.model-api.sora-2.v1';
export const COOL_VEO_3_1_FAST_EXECUTION_ID = 'cool.model-api.veo-31-fast.v1';
export const COOL_VIDU_Q2_PRO_EXECUTION_ID = 'cool.model-api.vidu-q2-pro.v1';
export const COOL_VIDU_Q3_EXECUTION_ID = 'cool.model-api.vidu-q3.v1';
export const COOL_VIDU_Q3_PRO_EXECUTION_ID = 'cool.model-api.vidu-q3-pro.v1';
export const COOL_WAN_2_6_EXECUTION_ID = 'cool.model-api.wan-26.v1';

// ---- Shared response mapping (COOL submit/poll pattern) ----
const COOL_VIDEO_RESPONSE_MAPPING = Object.freeze({
  taskIdPath: Object.freeze(['task_id']),
  statusPath: 'status',
  errorPath: 'error',
  resultPaths: Object.freeze(['result.url']),
});

// ---- COOL Task Polling Config ----
const COOL_VIDEO_TASK_POLLING = Object.freeze({
  mode: 'task-proxy',
  method: 'GET',
  urlTemplate: '{baseUrl}/v1/cool/task/{taskId}',
  headersMode: 'bearer',
});

// ---- COOL Video Body Mapping ----
const COOL_VIDEO_BODY_MAPPING = Object.freeze([
  Object.freeze({ path: 'model', from: 'model' }),
  Object.freeze({ path: 'prompt', from: 'prompt' }),
  Object.freeze({ path: 'n', from: 'constant', value: 1 }),
  Object.freeze({ path: 'resolution', from: 'param', field: 'resolution', defaultValue: '720p' }),
  Object.freeze({ path: 'ratio', from: 'param', field: ['resolvedRatioLabel', 'aspectRatio'], defaultValue: '16:9' }),
  Object.freeze({ path: 'duration', from: 'param', field: 'duration', defaultValue: 5 }),
  Object.freeze({ path: 'timeout', from: 'constant', value: 1800 }),
  Object.freeze({ path: 'image_urls', from: 'inputImages', omitWhenEmpty: true }),
  Object.freeze({ path: 'video_urls', from: 'inputVideos', omitWhenEmpty: true }),
]);

// ---- COOL Video UI Fields (参考 APIMart) ----
const COOL_VIDEO_RESOLUTION_FIELD = Object.freeze({
  id: 'resolution', type: 'segmented', placement: 'resolution',
  label: '分辨率', defaultValue: '720p',
  options: Object.freeze([
    Object.freeze({ value: '480p', label: '480P' }),
    Object.freeze({ value: '720p', label: '720P' }),
    Object.freeze({ value: '1080p', label: '1080P' }),
  ]),
});

const COOL_VIDEO_RATIO_FIELD = Object.freeze({
  id: 'aspectRatio', displayRole: 'aspectRatio', type: 'segmented', placement: 'resolution',
  label: '比例', defaultValue: '16:9',
  options: Object.freeze([
    Object.freeze({ value: '16:9', label: '16:9' }),
    Object.freeze({ value: '9:16', label: '9:16' }),
    Object.freeze({ value: '1:1', label: '1:1' }),
    Object.freeze({ value: '4:3', label: '4:3' }),
    Object.freeze({ value: '3:4', label: '3:4' }),
  ]),
});

const COOL_VIDEO_DURATION_FIELD = Object.freeze({
  id: 'duration', type: 'segmented', placement: 'resolution', variant: 'pillMenu',
  label: '时长', defaultValue: 5,
  options: Object.freeze([
    Object.freeze({ value: 2, label: '2s' }),
    Object.freeze({ value: 5, label: '5s' }),
    Object.freeze({ value: 8, label: '8s' }),
    Object.freeze({ value: 10, label: '10s' }),
    Object.freeze({ value: 15, label: '15s' }),
  ]),
});

// ---- Helper ----
function createCoolVideoExecution({ id, model, bodyMappingOverrides }) {
  const exec = createModelApiExecutionManifest({
    id,
    provider: 'cool',
    model,
    endpoint: '/v1/cool/generate',
    bodyMapping: bodyMappingOverrides || COOL_VIDEO_BODY_MAPPING,
    responseMapping: COOL_VIDEO_RESPONSE_MAPPING,
    taskPolling: COOL_VIDEO_TASK_POLLING,
    extensions: Object.freeze({
      bodyResolver: 'coolGenerate',
    }),
  });
  // createModelApiExecutionManifest 硬编码 kind:'image'，
  // 但 COOL 视频的 execution manifest 必须是 kind:'video'，
  // 否则 assertModelExecutionContract 校验 model.kind !== execution.kind 报错。
  return Object.freeze({ ...exec, kind: 'video' });
}

function createVideoModel({ modelId, executionId, displayName, subtitle, order, group }) {
  const manifest = createImageModelApiManifest({
    modelId,
    executionId,
    provider: 'cool',
    displayName,
    description: `COOL · ${subtitle}`,
    inputSlots: Object.freeze({
      allowedKinds: Object.freeze(['text', 'image', 'video']),
      minByKind: Object.freeze({ image: 0, video: 0 }),
      maxByKind: Object.freeze({ image: 9, video: 2, audio: 0 }),
    }),
    fields: [COOL_VIDEO_RESOLUTION_FIELD, COOL_VIDEO_RATIO_FIELD, COOL_VIDEO_DURATION_FIELD],
    extensions: Object.freeze({
      videoMenu: Object.freeze({
        group: group || 'cool-video',
        order,
        title: displayName,
        subtitle: 'COOL · ' + subtitle,
        gap: 5,
      }),
      fixedInputSlots: Object.freeze([
        Object.freeze({ id: 'refImage', kind: 'image', label: '参考图', displayOrder: 0, isUploader: true }),
        Object.freeze({ id: 'refVideo', kind: 'video', label: '参考视频', displayOrder: 1, isUploader: true }),
      ]),
    }),
    ratioPolicy: Object.freeze({
      capability: 'aspectRatio',
    }),
  });
  // createImageModelApiManifest 硬编码 kind:'image'，不接受 kind 参数。
  // COOL 视频模型需要 kind:'video' 才能被 getModelsByKind('video') 查到。
  return Object.freeze({ ...manifest, kind: 'video' });
}

// ============== 视频模型清单 (25个) ==============

// Group helpers for Seedance price labels
const SANDANCE_PER_SEC = '按秒计费';
const SANDANCE_PER_GEN = '按次计费';

export const coolVideoModelApiModelManifests = Object.freeze([
  // --- 非 Seedance 视频模型 ---
  createVideoModel({
    modelId: COOL_GROK_IMAGINE_VIDEO_MODEL_ID, executionId: COOL_GROK_IMAGINE_VIDEO_EXECUTION_ID,
    displayName: 'Grok Imagine Video', subtitle: '1 积分/次',
    order: 10, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_HAPPYHORSE_1_MODEL_ID, executionId: COOL_HAPPYHORSE_1_EXECUTION_ID,
    displayName: 'HappyHorse 1', subtitle: '0.2 积分/秒',
    order: 20, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_KLING_3_AUDIO_MODEL_ID, executionId: COOL_KLING_3_AUDIO_EXECUTION_ID,
    displayName: 'Kling 3 Audio', subtitle: '0.2 积分/秒 · 带音频',
    order: 30, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_KLING_3_OMNI_MODEL_ID, executionId: COOL_KLING_3_OMNI_EXECUTION_ID,
    displayName: 'Kling 3 Omni', subtitle: '0.2 积分/秒 · 全能版',
    order: 32, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_KLING_3_SILENT_MODEL_ID, executionId: COOL_KLING_3_SILENT_EXECUTION_ID,
    displayName: 'Kling 3 Silent', subtitle: '0.2 积分/秒 · 静音',
    order: 34, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_1_5_PRO_AUDIO_MODEL_ID, executionId: COOL_SEEDANCE_1_5_PRO_AUDIO_EXECUTION_ID,
    displayName: 'Seedance 1.5 Pro Audio', subtitle: '1 积分/次 · 带音频',
    order: 40, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_1_5_PRO_SILENT_MODEL_ID, executionId: COOL_SEEDANCE_1_5_PRO_SILENT_EXECUTION_ID,
    displayName: 'Seedance 1.5 Pro Silent', subtitle: '1 积分/次 · 无音频',
    order: 42, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_SORA_2_MODEL_ID, executionId: COOL_SORA_2_EXECUTION_ID,
    displayName: 'Sora 2', subtitle: '1 积分/次',
    order: 50, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_WAN_2_6_MODEL_ID, executionId: COOL_WAN_2_6_EXECUTION_ID,
    displayName: 'Wan 2.6', subtitle: '1 积分/次 · 阿里万相',
    order: 60, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_VEO_3_1_FAST_MODEL_ID, executionId: COOL_VEO_3_1_FAST_EXECUTION_ID,
    displayName: 'Veo 3.1 Fast', subtitle: '1 积分/次 (VIP)',
    order: 65, group: 'cool-video-vip',
  }),
  createVideoModel({
    modelId: COOL_VIDU_Q2_PRO_MODEL_ID, executionId: COOL_VIDU_Q2_PRO_EXECUTION_ID,
    displayName: 'Vidu Q2 Pro', subtitle: '1 积分/次',
    order: 70, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_VIDU_Q3_MODEL_ID, executionId: COOL_VIDU_Q3_EXECUTION_ID,
    displayName: 'Vidu Q3', subtitle: '1 积分/次',
    order: 72, group: 'cool-video',
  }),
  createVideoModel({
    modelId: COOL_VIDU_Q3_PRO_MODEL_ID, executionId: COOL_VIDU_Q3_PRO_EXECUTION_ID,
    displayName: 'Vidu Q3 Pro', subtitle: '1 积分/次',
    order: 74, group: 'cool-video',
  }),

  // --- Seedance 2 系列 (12个变体) ---
  createVideoModel({
    modelId: COOL_SEEDANCE_2_MODEL_ID, executionId: COOL_SEEDANCE_2_EXECUTION_ID,
    displayName: 'Seedance 2', subtitle: '0.75 积分/秒 · 720p',
    order: 100, group: 'cool-video-seedance',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_480P_MODEL_ID, executionId: COOL_SEEDANCE_2_480P_EXECUTION_ID,
    displayName: 'Seedance 2 480p', subtitle: '0.42 积分/秒 (VIP)',
    order: 102, group: 'cool-video-vip',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_480P_VIDEO_MODEL_ID, executionId: COOL_SEEDANCE_2_480P_VIDEO_EXECUTION_ID,
    displayName: 'Seedance 2 480p Video', subtitle: '0.58 积分/秒 · 带视频参考',
    order: 103, group: 'cool-video-seedance',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_720P_MODEL_ID, executionId: COOL_SEEDANCE_2_720P_EXECUTION_ID,
    displayName: 'Seedance 2 720p', subtitle: '0.75 积分/秒 (VIP)',
    order: 104, group: 'cool-video-vip',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_720P_VIDEO_MODEL_ID, executionId: COOL_SEEDANCE_2_720P_VIDEO_EXECUTION_ID,
    displayName: 'Seedance 2 720p Video', subtitle: '1.26 积分/秒 · 带视频参考',
    order: 105, group: 'cool-video-seedance',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_1080P_MODEL_ID, executionId: COOL_SEEDANCE_2_1080P_EXECUTION_ID,
    displayName: 'Seedance 2 1080p', subtitle: '1.7 积分/秒 (VIP)',
    order: 106, group: 'cool-video-vip',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_1080P_VIDEO_MODEL_ID, executionId: COOL_SEEDANCE_2_1080P_VIDEO_EXECUTION_ID,
    displayName: 'Seedance 2 1080p Video', subtitle: '2.83 积分/秒 · 带视频参考',
    order: 107, group: 'cool-video-seedance',
  }),

  // --- Seedance 2 Fast 系列 (5个变体) ---
  createVideoModel({
    modelId: COOL_SEEDANCE_2_FAST_MODEL_ID, executionId: COOL_SEEDANCE_2_FAST_EXECUTION_ID,
    displayName: 'Seedance 2 Fast', subtitle: '0.59 积分/秒 · 720p · 推荐',
    order: 110, group: 'cool-video-seedance',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_FAST_480P_MODEL_ID, executionId: COOL_SEEDANCE_2_FAST_480P_EXECUTION_ID,
    displayName: 'Seedance 2 Fast 480p', subtitle: '0.36 积分/秒',
    order: 111, group: 'cool-video-seedance',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_FAST_480P_VIDEO_MODEL_ID, executionId: COOL_SEEDANCE_2_FAST_480P_VIDEO_EXECUTION_ID,
    displayName: 'Seedance 2 Fast 480p Video', subtitle: '0.46 积分/秒 · 带视频参考',
    order: 112, group: 'cool-video-seedance',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_FAST_720P_MODEL_ID, executionId: COOL_SEEDANCE_2_FAST_720P_EXECUTION_ID,
    displayName: 'Seedance 2 Fast 720p', subtitle: '0.59 积分/秒',
    order: 114, group: 'cool-video-seedance',
  }),
  createVideoModel({
    modelId: COOL_SEEDANCE_2_FAST_720P_VIDEO_MODEL_ID, executionId: COOL_SEEDANCE_2_FAST_720P_VIDEO_EXECUTION_ID,
    displayName: 'Seedance 2 Fast 720p Video', subtitle: '0.99 积分/秒 · 带视频参考',
    order: 115, group: 'cool-video-seedance',
  }),
]);

// ============== 执行清单 (25个) ==============

export const coolVideoModelApiExecutionManifests = Object.freeze([
  // 非 Seedance 视频 (13个)
  createCoolVideoExecution({ id: COOL_GROK_IMAGINE_VIDEO_EXECUTION_ID, model: 'grok_imagine_video' }),
  createCoolVideoExecution({ id: COOL_HAPPYHORSE_1_EXECUTION_ID, model: 'happyhorse_1' }),
  createCoolVideoExecution({ id: COOL_KLING_3_AUDIO_EXECUTION_ID, model: 'kling_3_audio' }),
  createCoolVideoExecution({ id: COOL_KLING_3_OMNI_EXECUTION_ID, model: 'kling_3_omni' }),
  createCoolVideoExecution({ id: COOL_KLING_3_SILENT_EXECUTION_ID, model: 'kling_3_silent' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_1_5_PRO_AUDIO_EXECUTION_ID, model: 'seedance_1_5_pro_audio' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_1_5_PRO_SILENT_EXECUTION_ID, model: 'seedance_1_5_pro_silent' }),
  createCoolVideoExecution({ id: COOL_SORA_2_EXECUTION_ID, model: 'sora_2' }),
  createCoolVideoExecution({ id: COOL_WAN_2_6_EXECUTION_ID, model: 'wan_2_6' }),
  createCoolVideoExecution({ id: COOL_VEO_3_1_FAST_EXECUTION_ID, model: 'veo_3_1_fast' }),
  createCoolVideoExecution({ id: COOL_VIDU_Q2_PRO_EXECUTION_ID, model: 'vidu_q2_pro' }),
  createCoolVideoExecution({ id: COOL_VIDU_Q3_EXECUTION_ID, model: 'vidu_q3' }),
  createCoolVideoExecution({ id: COOL_VIDU_Q3_PRO_EXECUTION_ID, model: 'vidu_q3_pro' }),

  // Seedance 2 (7个)
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_EXECUTION_ID, model: 'seedance_2' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_480P_EXECUTION_ID, model: 'seedance_2_480p' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_480P_VIDEO_EXECUTION_ID, model: 'seedance_2_480p_video' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_720P_EXECUTION_ID, model: 'seedance_2_720p' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_720P_VIDEO_EXECUTION_ID, model: 'seedance_2_720p_video' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_1080P_EXECUTION_ID, model: 'seedance_2_1080p' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_1080P_VIDEO_EXECUTION_ID, model: 'seedance_2_1080p_video' }),

  // Seedance 2 Fast (5个)
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_FAST_EXECUTION_ID, model: 'seedance_2_fast' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_FAST_480P_EXECUTION_ID, model: 'seedance_2_fast_480p' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_FAST_480P_VIDEO_EXECUTION_ID, model: 'seedance_2_fast_480p_video' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_FAST_720P_EXECUTION_ID, model: 'seedance_2_fast_720p' }),
  createCoolVideoExecution({ id: COOL_SEEDANCE_2_FAST_720P_VIDEO_EXECUTION_ID, model: 'seedance_2_fast_720p_video' }),
]);
