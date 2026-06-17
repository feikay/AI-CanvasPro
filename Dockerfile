# ===========================================
# AI CanvasPro - 容器化部署 Dockerfile
# 基于 Python 3.11，运行 server.py HTTP 服务
# ===========================================

FROM python:3.11-slim-bookworm

LABEL maintainer="AI-CanvasPro"
LABEL description="AI CanvasPro - 多模态 AI 画布编辑器"

# 设置工作目录
WORKDIR /app

# 安装系统依赖（opencv-python 需要 libgl1 等运行时库）
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# 先复制依赖文件，利用 Docker 缓存层
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目文件（排除 .dockerignore 中的内容）
COPY . .

# 创建运行时数据目录
RUN mkdir -p /app/user /app/data/uploads /app/data/output

# 暴露服务端口
EXPOSE 8777

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8777/')" || exit 1

# 启动服务：绑定 0.0.0.0，开启局域网模式
ENV AIC_BIND_HOST=0.0.0.0 \
    AIC_LAN_MODE=1

CMD ["python", "server.py"]
