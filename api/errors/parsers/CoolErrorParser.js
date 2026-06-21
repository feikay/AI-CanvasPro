/**
 * CoolErrorParser - COOL API 错误解析器
 * 
 * 解析 COOL API 返回的各种错误格式，转为统一的可读信息
 */

/**
 * 解析错误响应，返回标准化错误对象
 * @param {*} errorResponse - API 返回的错误数据
 * @returns {{ message: string, code: string, retryable: boolean }}
 */
export function parseError(errorResponse) {
  if (!errorResponse) {
    return {
      message: 'COOL API 未知错误',
      code: 'unknown',
      retryable: true,
    };
  }

  // 网络错误
  if (typeof errorResponse === 'string') {
    const msg = errorResponse.toLowerCase();
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return {
        message: 'COOL API 请求超时，请稍后重试',
        code: 'timeout',
        retryable: true,
      };
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('econnrefused')) {
      return {
        message: 'COOL API 网络连接失败，请检查网络',
        code: 'network_error',
        retryable: true,
      };
    }
    return {
      message: errorResponse,
      code: 'unknown',
      retryable: true,
    };
  }

  // HTTP 状态码错误
  const status = Number(errorResponse.status || errorResponse.statusCode || 0);

  if (status === 400) {
    return {
      message: errorResponse.message || errorResponse.error || 'COOL API 请求参数无效或模型 key 未知',
      code: 'bad_request',
      retryable: false,
    };
  }

  if (status === 401 || status === 403) {
    return {
      message: 'COOL API Key 无效或已过期，请检查 API Key 是否正确',
      code: 'auth_failed',
      retryable: false,
    };
  }

  if (status === 402) {
    return {
      message: 'COOL 账户余额不足，请充值后再试',
      code: 'insufficient_balance',
      retryable: false,
    };
  }

  if (status === 429) {
    return {
      message: 'COOL API 请求频率过高，请稍后重试',
      code: 'rate_limited',
      retryable: true,
    };
  }

  if (status === 503) {
    return {
      message: 'COOL 服务器繁忙（并发上限），请稍后重试',
      code: 'server_busy',
      retryable: true,
    };
  }

  if (status >= 500) {
    return {
      message: errorResponse.message || errorResponse.error || 'COOL 服务器内部错误',
      code: 'server_error',
      retryable: true,
    };
  }

  // 任务失败 — status 为 'failed' 的轮询结果
  if (errorResponse.status === 'failed') {
    return {
      message: errorResponse.error || 'COOL 任务执行失败',
      code: 'task_failed',
      retryable: false,
    };
  }

  // 默认
  return {
    message: String(errorResponse.message || errorResponse.error || errorResponse.detail || 'COOL API 未知错误'),
    code: 'unknown',
    retryable: true,
  };
}

/**
 * 从 HTTP 响应中提取错误信息
 * @param {Response} response - fetch Response 对象
 * @returns {Promise<{ message: string, code: string, retryable: boolean }>}
 */
export async function parseHttpError(response) {
  try {
    const data = await response.json();
    return parseError({ ...data, status: response.status });
  } catch {
    return parseError({ status: response.status, message: response.statusText });
  }
}
