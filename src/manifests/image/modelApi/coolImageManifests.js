/**
 * COOL 图片模型清单 (MJ API)
 * 共 9 个图片模型
 * 
 * 采用 modelApi 适配器类型，通过 bodyResolver='coolGenerate' 委托给 CoolAdapter 构建请求
 */

import {
  createImageModelApiManifest,
  createModelApiExecutionManifest,
  IMAGE_SIZE_FIELD,
  ASPECT_RATIO_FIELD,
  BATCH_SIZE_FIELD,
  IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
} from './sharedImageModelApiFields.js';

// ---- Model IDs ----
export const COOL_FLUX_KONTEXT_PRO_MODEL_ID = 'cool/flux_kontext_pro';
export const COOL_GPT_IMAGE_2_MODEL_ID = 'cool/gpt_image_2';
export const COOL_GPT_IMAGE_2_4K_MODEL_ID = 'cool/gpt_image_2_4k';
export const COOL_MIDJOURNEY_V7_MODEL_ID = 'cool/midjourney_v7';
export const COOL_NANO_BANANA_2_MODEL_ID = 'cool/nano_banana_2';
export const COOL_NANO_BANANA_2_4K_MODEL_ID = 'cool/nano_banana_2_4k';
export const COOL_NANO_BANANA_PRO_MODEL_ID = 'cool/nano_banana_pro';
export const COOL_NANO_BANANA_PRO_4K_MODEL_ID = 'cool/nano_banana_pro_4k';
export const COOL_SEEDREAM_4_5_MODEL_ID = 'cool/seedream_4_5';

// ---- Execution IDs ----
export const COOL_FLUX_KONTEXT_PRO_EXECUTION_ID = 'cool.model-api.flux-kontext-pro.v1';
export const COOL_GPT_IMAGE_2_EXECUTION_ID = 'cool.model-api.gpt-image-2.v1';
export const COOL_GPT_IMAGE_2_4K_EXECUTION_ID = 'cool.model-api.gpt-image-2-4k.v1';
export const COOL_MIDJOURNEY_V7_EXECUTION_ID = 'cool.model-api.midjourney-v7.v1';
export const COOL_NANO_BANANA_2_EXECUTION_ID = 'cool.model-api.nano-banana-2.v1';
export const COOL_NANO_BANANA_2_4K_EXECUTION_ID = 'cool.model-api.nano-banana-2-4k.v1';
export const COOL_NANO_BANANA_PRO_EXECUTION_ID = 'cool.model-api.nano-banana-pro.v1';
export const COOL_NANO_BANANA_PRO_4K_EXECUTION_ID = 'cool.model-api.nano-banana-pro-4k.v1';
export const COOL_SEEDREAM_4_5_EXECUTION_ID = 'cool.model-api.seedream-45.v1';

// ---- Image Size Field (COOL uses 2K/4K, selective 1K) ----
const COOL_IMAGE_SIZE_2K4K = {
  ...IMAGE_SIZE_FIELD,
  defaultValue: '2K',
  options: Object.freeze([
    Object.freeze({ value: '2K', label: '2K' }),
    Object.freeze({ value: '4K', label: '4K' }),
  ]),
};

const COOL_IMAGE_SIZE_1K2K4K = {
  ...IMAGE_SIZE_FIELD,
  defaultValue: '2K',
  options: Object.freeze([
    Object.freeze({ value: '1K', label: '1K' }),
    Object.freeze({ value: '2K', label: '2K' }),
    Object.freeze({ value: '4K', label: '4K' }),
  ]),
};

// ---- Shared response mapping (COOL submit/poll pattern) ----
const COOL_IMAGE_RESPONSE_MAPPING = Object.freeze({
  taskIdPath: Object.freeze(['task_id']),
  statusPath: 'status',
  errorPath: 'error',
  resultPaths: Object.freeze(['result.url']),
});

// ---- COOL Task Polling Config ----
const COOL_IMAGE_TASK_POLLING = Object.freeze({
  mode: 'task-proxy',
  method: 'GET',
  urlTemplate: '{baseUrl}/v1/cool/task/{taskId}',
  headersMode: 'bearer',
});

// ---- Shared body mapping ----
// 后端 _handle_cool_generate 自动将 image_urls 转为 COOL 的 files 格式
const COOL_IMAGE_BODY_MAPPING = Object.freeze([
  Object.freeze({ path: 'model', from: 'model' }),
  Object.freeze({ path: 'prompt', from: 'prompt' }),
  Object.freeze({ path: 'n', from: 'constant', value: 1 }),
  Object.freeze({ path: 'resolution', from: 'param', field: 'imageSize', defaultValue: '2K' }),
  Object.freeze({ path: 'ratio', from: 'param', field: ['resolvedRatioLabel', 'aspectRatio'], defaultValue: '16:9' }),
  Object.freeze({ path: 'timeout', from: 'constant', value: 300 }),
  Object.freeze({ path: 'image_urls', from: 'inputImages', omitWhenEmpty: true }),
]);

// ---- Helper to create COOL image execution manifest ----
function createCoolImageExecution({ id, model, bodyMappingOverrides }) {
  return createModelApiExecutionManifest({
    id,
    provider: 'cool',
    model,
    endpoint: '/v1/cool/generate',
    bodyMapping: bodyMappingOverrides || COOL_IMAGE_BODY_MAPPING,
    responseMapping: COOL_IMAGE_RESPONSE_MAPPING,
    taskPolling: COOL_IMAGE_TASK_POLLING,
  });
}

// ============== 模型清单 (10个) ==============

export const coolImageModelApiModelManifests = Object.freeze([
  // 1. Flux Kontext Pro
  createImageModelApiManifest({
    modelId: COOL_FLUX_KONTEXT_PRO_MODEL_ID,
    executionId: COOL_FLUX_KONTEXT_PRO_EXECUTION_ID,
    provider: 'cool',
    displayName: 'Flux Kontext Pro',
    description: 'Black Forest Labs 旗舰图像生成模型 (COOL)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [COOL_IMAGE_SIZE_2K4K, ASPECT_RATIO_FIELD, BATCH_SIZE_FIELD],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool',
        order: 10,
        title: 'Flux Kontext Pro',
        subtitle: 'COOL · 0.07 积分/次',
        gap: 10,
      }),
    }),
  }),

  // 2. GPT Image 2
  createImageModelApiManifest({
    modelId: COOL_GPT_IMAGE_2_MODEL_ID,
    executionId: COOL_GPT_IMAGE_2_EXECUTION_ID,
    provider: 'cool',
    displayName: 'GPT Image 2',
    description: 'OpenAI 图像生成模型 (COOL)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [COOL_IMAGE_SIZE_1K2K4K, ASPECT_RATIO_FIELD, BATCH_SIZE_FIELD],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool',
        order: 20,
        title: 'GPT Image 2',
        subtitle: 'COOL · 0.07 积分/次',
        gap: 10,
      }),
    }),
  }),

  // 3. GPT Image 2 4K (VIP)
  createImageModelApiManifest({
    modelId: COOL_GPT_IMAGE_2_4K_MODEL_ID,
    executionId: COOL_GPT_IMAGE_2_4K_EXECUTION_ID,
    provider: 'cool',
    displayName: 'GPT Image 2 (4K)',
    description: 'OpenAI 图像生成 · 4K 高分辨率 (COOL VIP)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [
      { ...COOL_IMAGE_SIZE_1K2K4K, defaultValue: '4K' },
      ASPECT_RATIO_FIELD,
      BATCH_SIZE_FIELD,
    ],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool-vip',
        order: 25,
        title: 'GPT Image 2 4K',
        subtitle: 'COOL VIP · 0.11 积分/次',
        gap: 10,
      }),
    }),
  }),

  // 4. Midjourney V7
  createImageModelApiManifest({
    modelId: COOL_MIDJOURNEY_V7_MODEL_ID,
    executionId: COOL_MIDJOURNEY_V7_EXECUTION_ID,
    provider: 'cool',
    displayName: 'Midjourney V7',
    description: 'Midjourney 最新版 (COOL)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [COOL_IMAGE_SIZE_2K4K, ASPECT_RATIO_FIELD, BATCH_SIZE_FIELD],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool',
        order: 30,
        title: 'Midjourney V7',
        subtitle: 'COOL · 0.07 积分/次 · 约10分钟',
        gap: 10,
      }),
    }),
  }),

  // 5. Nano Banana 2
  createImageModelApiManifest({
    modelId: COOL_NANO_BANANA_2_MODEL_ID,
    executionId: COOL_NANO_BANANA_2_EXECUTION_ID,
    provider: 'cool',
    displayName: 'Nano Banana 2',
    description: '快速图像生成 (COOL)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [COOL_IMAGE_SIZE_1K2K4K, ASPECT_RATIO_FIELD, BATCH_SIZE_FIELD],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool',
        order: 40,
        title: 'Nano Banana 2',
        subtitle: 'COOL · 0.07 积分/次',
        gap: 10,
      }),
    }),
  }),

  // 6. Nano Banana 2 4K (VIP)
  createImageModelApiManifest({
    modelId: COOL_NANO_BANANA_2_4K_MODEL_ID,
    executionId: COOL_NANO_BANANA_2_4K_EXECUTION_ID,
    provider: 'cool',
    displayName: 'Nano Banana 2 (4K)',
    description: 'Nano Banana 2 · 4K 高分辨率 (COOL VIP)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [
      { ...COOL_IMAGE_SIZE_1K2K4K, defaultValue: '4K' },
      ASPECT_RATIO_FIELD,
      BATCH_SIZE_FIELD,
    ],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool-vip',
        order: 45,
        title: 'Nano Banana 2 4K',
        subtitle: 'COOL VIP · 0.11 积分/次',
        gap: 10,
      }),
    }),
  }),

  // 7. Nano Banana Pro
  createImageModelApiManifest({
    modelId: COOL_NANO_BANANA_PRO_MODEL_ID,
    executionId: COOL_NANO_BANANA_PRO_EXECUTION_ID,
    provider: 'cool',
    displayName: 'Nano Banana Pro',
    description: '高质量图像生成 (COOL)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [COOL_IMAGE_SIZE_1K2K4K, ASPECT_RATIO_FIELD, BATCH_SIZE_FIELD],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool',
        order: 50,
        title: 'Nano Banana Pro',
        subtitle: 'COOL · 0.07 积分/次',
        gap: 10,
      }),
    }),
  }),

  // 8. Nano Banana Pro 4K (VIP)
  createImageModelApiManifest({
    modelId: COOL_NANO_BANANA_PRO_4K_MODEL_ID,
    executionId: COOL_NANO_BANANA_PRO_4K_EXECUTION_ID,
    provider: 'cool',
    displayName: 'Nano Banana Pro (4K)',
    description: 'Nano Banana Pro · 4K (COOL VIP)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [
      { ...COOL_IMAGE_SIZE_1K2K4K, defaultValue: '4K' },
      ASPECT_RATIO_FIELD,
      BATCH_SIZE_FIELD,
    ],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool-vip',
        order: 55,
        title: 'Nano Banana Pro 4K',
        subtitle: 'COOL VIP · 0.11 积分/次',
        gap: 10,
      }),
    }),
  }),

  // 9. Seedream 4.5
  createImageModelApiManifest({
    modelId: COOL_SEEDREAM_4_5_MODEL_ID,
    executionId: COOL_SEEDREAM_4_5_EXECUTION_ID,
    provider: 'cool',
    displayName: 'Seedream 4.5',
    description: '字节跳动 Seedream 图像模型 (COOL)',
    inputSlots: IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
    fields: [COOL_IMAGE_SIZE_2K4K, ASPECT_RATIO_FIELD, BATCH_SIZE_FIELD],
    extensions: Object.freeze({
      imageMenu: Object.freeze({
        group: 'cool',
        order: 70,
        title: 'Seedream 4.5',
        subtitle: 'COOL · 0.07 积分/次',
        gap: 10,
      }),
    }),
  }),
]);

// ============== 执行清单 (9个) ==============

export const coolImageModelApiExecutionManifests = Object.freeze([
  createCoolImageExecution({
    id: COOL_FLUX_KONTEXT_PRO_EXECUTION_ID,
    model: 'flux_kontext_pro',
  }),
  createCoolImageExecution({
    id: COOL_GPT_IMAGE_2_EXECUTION_ID,
    model: 'gpt_image_2',
  }),
  createCoolImageExecution({
    id: COOL_GPT_IMAGE_2_4K_EXECUTION_ID,
    model: 'gpt_image_2',
  }),
  createCoolImageExecution({
    id: COOL_MIDJOURNEY_V7_EXECUTION_ID,
    model: 'midjourney_v7',
  }),
  createCoolImageExecution({
    id: COOL_NANO_BANANA_2_EXECUTION_ID,
    model: 'nano_banana_2',
  }),
  createCoolImageExecution({
    id: COOL_NANO_BANANA_2_4K_EXECUTION_ID,
    model: 'nano_banana_2',
  }),
  createCoolImageExecution({
    id: COOL_NANO_BANANA_PRO_EXECUTION_ID,
    model: 'nano_banana_pro',
  }),
  createCoolImageExecution({
    id: COOL_NANO_BANANA_PRO_4K_EXECUTION_ID,
    model: 'nano_banana_pro',
  }),
  createCoolImageExecution({
    id: COOL_SEEDREAM_4_5_EXECUTION_ID,
    model: 'seedream_4_5',
  }),
]);
