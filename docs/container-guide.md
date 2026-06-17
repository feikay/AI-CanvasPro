# AI CanvasPro 容器化操作手册

> 版本：v1.0 | 适用版本：AI-CanvasPro v0.4.10+

---

## 目录

1. [前置环境要求](#1-前置环境要求)
2. [项目文件结构](#2-项目文件结构)
3. [快速开始（本地部署）](#3-快速开始本地部署)
4. [环境变量配置详解](#4-环境变量配置详解)
5. [镜像构建详解](#5-镜像构建详解)
6. [容器运行与管理](#6-容器运行与管理)
7. [云端生产部署](#7-云端生产部署)
8. [数据备份与恢复](#8-数据备份与恢复)
9. [常见问题排查](#9-常见问题排查)
10. [附录：命令速查表](#10-附录命令速查表)

---

## 1. 前置环境要求

| 软件 | 最低版本 | 用途 |
|------|---------|------|
| Docker | 20.10+ | 容器运行时 |
| Docker Compose | v2.0+ (plugin) | 多容器编排 |
| Git | 2.0+ | 拉取代码（可选） |

### 安装验证

```bash
docker --version
# Docker version 24.0.x, build ...

docker compose version
# Docker Compose version v2.x.x
```

### 系统要求

| 项目 | 最低 | 推荐 |
|------|------|------|
| CPU | 1 核 | 2 核以上 |
| 内存 | 1 GB | 2 GB 以上 |
| 磁盘 | 2 GB（不含用户数据） | 10 GB 以上 SSD |
| 网络 | 可访问外网 | 稳定公网出口 |

---

## 2. 项目文件结构

```
AI-CanvasPro/
├── Dockerfile              # 容器镜像构建定义
├── .dockerignore           # 构建时忽略的文件
├── docker-compose.yml      # 多容器编排配置
├── .env.example            # 环境变量模板
├── DEPLOY.md               # 部署说明（简明版）
├── docs/
│   └── container-guide.md  # 本手册
├── server.py               # 主服务入口
├── requirements.txt        # Python 依赖
├── backend/                # 后端服务模块
├── api/                    # 前端 API 层
├── src/                    # 前端源码
├── index.html              # 主页面
├── main.js                 # 前端主入口
├── style.css               # 样式表
├── assets/                 # 静态资源
├── user/                   # 用户数据目录（运行时生成）
└── data/                   # 数据目录（运行时生成）
```

---

## 3. 快速开始（本地部署）

### 3.1 首次部署（4 步完成）

```bash
# 步骤 1：进入项目目录
cd AI-CanvasPro

# 步骤 2：复制环境变量配置（可选，不配置也可启动）
cp .env.example .env

# 步骤 3：构建镜像并启动容器
docker compose up -d --build

# 步骤 4：验证服务
curl http://localhost:8777/
```

访问浏览器 `http://localhost:8777`，看到 AI CanvasPro 界面即部署成功。

### 3.2 查看运行状态

```bash
# 查看容器状态
docker compose ps

# 查看实时日志
docker compose logs -f

# 查看最近 50 行日志
docker compose logs --tail=50
```

### 3.3 停止与重启

```bash
# 停止服务（保留容器和数据）
docker compose stop

# 启动已停止的服务
docker compose start

# 重启服务
docker compose restart

# 停止并删除容器（数据卷保留）
docker compose down

# 停止并删除容器 + 数据卷（危险操作！）
docker compose down -v
```

---

## 4. 环境变量配置详解

复制 `.env.example` 为 `.env`，按需修改：

```bash
cp .env.example .env
```

### 4.1 完整环境变量表

| 变量名 | 默认值 | 必填 | 说明 |
|--------|--------|------|------|
| `AICANVAS_PORT` | `8777` | 否 | 服务监听端口 |
| `AIC_BIND_HOST` | `0.0.0.0` | 否 | Docker 内已自动设为 `0.0.0.0` |
| `AIC_LAN_MODE` | `1` | 否 | Docker 内已自动启用 |
| `AIC_LOG_LEVEL` | `basic` | 否 | 日志级别：`off`(静默) / `basic`(标准) / `verbose`(详细) |
| `AIC_ALLOWED_ORIGINS` | 空 | 云端必填 | 允许的 CORS Origin，多个逗号分隔 |
| `AIC_LOCAL_TOKEN` | 空 | 否 | 本地访问令牌（设置后请求需携带） |
| `AIC_SUBSCRIPTION_API_BASE` | `https://api.ashuoai.com` | 否 | 订阅授权服务器地址 |
| `HTTP_PROXY` | 空 | 否 | HTTP 代理（如需科学上网） |
| `HTTPS_PROXY` | 空 | 否 | HTTPS 代理 |

### 4.2 配置示例

#### 本地开发

```bash
# .env
AICANVAS_PORT=8777
AIC_LOG_LEVEL=verbose
AIC_ALLOWED_ORIGINS=http://localhost:8777
```

#### 云端生产

```bash
# .env
AICANVAS_PORT=8777
AIC_LOG_LEVEL=basic
AIC_ALLOWED_ORIGINS=https://canvas.your-domain.com,https://www.your-domain.com
HTTP_PROXY=http://proxy-server:7890
HTTPS_PROXY=http://proxy-server:7890
```

### 4.3 环境变量生效方式

- `.env` 文件中的变量由 `docker compose` 自动读取
- 也可以临时覆盖：`AICANVAS_PORT=8080 docker compose up -d`
- 修改 `.env` 后需重启容器：`docker compose down && docker compose up -d`

### 4.4 Linux 部署目录自定义

默认所有数据存储在项目目录下。如需将数据放到独立磁盘或 NFS 挂载，可通过以下环境变量覆盖：

```bash
# 示例：将所有数据放到 /mnt/data/ 下
AIC_USER_DIR=/mnt/data/canvaspro/user
AIC_OUTPUT_DIR=/mnt/data/canvaspro/output
AIC_DATA_DIR=/mnt/data/canvaspro/data
```

配置后同步修改 `docker-compose.yml` 的 volumes 挂载路径：

```yaml
volumes:
  - /mnt/data/canvaspro/user:/mnt/data/canvaspro/user
  - /mnt/data/canvaspro/data:/mnt/data/canvaspro/data
  - /mnt/data/canvaspro/output:/mnt/data/canvaspro/output
```

目录层级关系（不设环境变量时的默认值）：

```
/app/                          # 容器内项目根目录
├── user/                      # AIC_USER_DIR，用户数据根
│   ├── Canvas Project/        # AIC_CANVAS_DIR，画布项目
│   ├── config.json            # API Key 配置
│   └── settings.json          # 应用设置
├── data/                      # AIC_DATA_DIR，数据根
│   ├── uploads/               # AIC_UPLOADS_DIR，上传文件
│   ├── assets/                # 资源 + 缩略图
│   │   ├── thumbs/
│   │   └── workflows/thumbs/
│   └── workflows/             # 工作流定义
├── output/                    # AIC_OUTPUT_DIR，生成文件
└── server.py
```

> **注意**：`UPLOADS_DIR`、`ASSETS_DIR`、`WORKFLOWS_DIR` 默认是 `DATA_DIR` 的子目录。如果只覆盖 `AIC_DATA_DIR`，这些子目录会自动跟随；如果单独覆盖 `AIC_UPLOADS_DIR` 等，子目录将独立。

---

## 5. 镜像构建详解

### 5.1 构建流程

```
python:3.11-slim-bookworm
        │
        ├── [Layer 1] 安装系统依赖 (libgl1, ffmpeg, libgomp1...)
        │
        ├── [Layer 2] 安装 Python 依赖 (requests, pillow, opencv-python, scenedetect)
        │
        └── [Layer 3] 复制项目文件 + 创建运行时目录
```

### 5.2 构建命令

```bash
# 标准构建（使用 docker-compose）
docker compose build

# 强制重新构建（不使用缓存）
docker compose build --no-cache

# 仅构建，不启动
docker compose build --pull

# 构建并启动
docker compose up -d --build

# 直接使用 Docker 构建
docker build -t ai-canvaspro:latest .

# 指定构建参数
docker build \
  --build-arg PYTHON_VERSION=3.11 \
  -t ai-canvaspro:v0.4.10 \
  .
```

### 5.3 多架构构建（适用于 ARM/AMD64 混合集群）

```bash
# 创建 buildx 构建器
docker buildx create --name multiarch --use

# 构建多架构镜像并推送
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t your-registry.com/ai-canvaspro:latest \
  --push \
  .
```

### 5.4 镜像优化建议

```bash
# 查看镜像大小
docker images ai-canvaspro

# 使用 dive 分析镜像层
dive ai-canvaspro:latest

# 清理构建缓存
docker builder prune
```

---

## 6. 容器运行与管理

### 6.1 基础命令

```bash
# 启动所有服务（后台运行）
docker compose up -d

# 前台运行（查看实时日志）
docker compose up

# 查看运行状态
docker compose ps

# 查看详细状态
docker compose ps -a
```

### 6.2 日志管理

```bash
# 实时跟踪日志
docker compose logs -f

# 查看特定服务的日志
docker compose logs -f canvaspro

# 查看最近 100 行
docker compose logs --tail=100

# 按时间范围查看
docker compose logs --since=2026-06-16T20:00:00
```

### 6.3 进入容器调试

```bash
# 进入容器 shell
docker compose exec canvaspro sh

# 在容器内执行命令
docker compose exec canvaspro python -c "print('hello')"

# 查看容器内文件
docker compose exec canvaspro ls -la /app/user/

# 查看容器资源使用
docker stats ai-canvaspro
```

### 6.4 更新部署

```bash
# 拉取最新代码
git pull origin master

# 重新构建并重启
docker compose down
docker compose up -d --build

# 仅重启（无代码变更）
docker compose restart
```

### 6.5 健康检查

```bash
# 查看健康状态
docker inspect ai-canvaspro --format='{{json .State.Health}}' | python -m json.tool

# 手动健康检查
curl -o /dev/null -s -w "%{http_code}" http://localhost:8777/
```

---

## 7. 云端生产部署

### 7.1 架构图

```
Internet
    │
    ▼
┌─────────────────┐
│   Nginx (443)   │  ← HTTPS 终止 + 反向代理
│   nginx:alpine  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI CanvasPro   │  ← Python HTTP 服务
│   ai-canvaspro  │     端口: 8777 (内部)
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌──────┐  ┌──────┐
│ user │  │ data │  ← 宿主机挂载卷（持久化）
└──────┘  └──────┘
```

### 7.2 Nginx 配置文件

创建 `nginx/nginx.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书配置
    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # 文件上传大小限制
    client_max_body_size 500m;
    proxy_read_timeout   300s;
    proxy_send_timeout   300s;

    # 反向代理到 CanvasPro
    location / {
        proxy_pass http://canvaspro:8777;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
    }
}
```

### 7.3 完整生产 compose 文件

将以下内容合并到 `docker-compose.yml` 或创建 `docker-compose.prod.yml`：

```yaml
version: "3.8"

services:
  canvaspro:
    build:
      context: .
      dockerfile: Dockerfile
    image: ai-canvaspro:latest
    container_name: ai-canvaspro
    restart: unless-stopped
    environment:
      - AIC_BIND_HOST=0.0.0.0
      - AIC_LAN_MODE=1
      - AICANVAS_PORT=8777
      - AIC_ALLOWED_ORIGINS=${AIC_ALLOWED_ORIGINS}
    volumes:
      - ./user:/app/user
      - ./data:/app/data
      - ./output:/app/output
      - ./system-state:/root/.local/state/AI-CanvasPro
    # 资源限制
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: "2G"
        reservations:
          cpus: "1"
          memory: "1G"

  nginx:
    image: nginx:alpine
    container_name: canvaspro-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - canvaspro
    networks:
      - default

networks:
  default:
    name: ai-canvaspro-network
```

### 7.4 准备工作

```bash
# 创建目录结构
mkdir -p nginx/ssl user data output system-state

# 放置 SSL 证书
cp /path/to/fullchain.pem nginx/ssl/
cp /path/to/privkey.pem nginx/ssl/

# 配置环境变量
cat > .env << EOF
AIC_ALLOWED_ORIGINS=https://your-domain.com
EOF
```

### 7.5 启动生产环境

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 8. 数据备份与恢复

### 8.1 备份

```bash
# 创建备份目录
mkdir -p backups/$(date +%Y%m%d)

# 备份用户数据
tar -czf backups/$(date +%Y%m%d)/user-backup-$(date +%Y%m%d-%H%M%S).tar.gz ./user/

# 备份上传文件
tar -czf backups/$(date +%Y%m%d)/data-backup-$(date +%Y%m%d-%H%M%S).tar.gz ./data/

# 一键备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="./backups/${DATE}"
mkdir -p "${BACKUP_DIR}"
tar -czf "${BACKUP_DIR}/user.tar.gz" ./user/
tar -czf "${BACKUP_DIR}/data.tar.gz" ./data/
echo "备份完成: ${BACKUP_DIR}"
ls -lh "${BACKUP_DIR}"
EOF
chmod +x backup.sh

# 执行备份
./backup.sh
```

### 8.2 恢复

```bash
# 停止服务
docker compose down

# 恢复用户数据
tar -xzf backups/20260616/user-backup-20260616-120000.tar.gz -C ./

# 恢复上传数据
tar -xzf backups/20260616/data-backup-20260616-120000.tar.gz -C ./

# 重新启动
docker compose up -d
```

### 8.3 定时备份（crontab）

```bash
# 每天凌晨 2 点自动备份
crontab -e
# 添加以下行：
0 2 * * * cd /path/to/AI-CanvasPro && ./backup.sh >> backups/backup.log 2>&1
```

---

## 9. 常见问题排查

### 9.1 容器无法启动

```bash
# 查看详细错误日志
docker compose logs canvaspro

# 常见原因及解决：

# 1. 端口被占用
# 检查端口占用
netstat -tlnp | grep 8777
# 解决方案：修改 .env 中 AICANVAS_PORT

# 2. 构建失败
# 清理缓存重试
docker compose build --no-cache

# 3. 磁盘空间不足
# 清理无用镜像和容器
docker system prune -a
```

### 9.2 页面无法访问

```bash
# 1. 确认容器在运行
docker compose ps

# 2. 确认端口监听
docker compose exec canvaspro sh -c "netstat -tlnp | grep 8777" 2>/dev/null || \
  docker compose exec canvaspro sh -c "ss -tlnp | grep 8777"

# 3. 确认防火墙规则
# Linux (iptables)
sudo iptables -L -n | grep 8777
# 云服务器：检查安全组规则

# 4. 测试容器内服务
docker compose exec canvaspro wget -qO- http://127.0.0.1:8777/
```

### 9.3 跨域 CORS 错误

```
控制台报错：Access-Control-Allow-Origin 相关错误
```

解决方法：

```bash
# 确认 AIC_ALLOWED_ORIGINS 配置
docker compose exec canvaspro sh -c 'echo $AIC_ALLOWED_ORIGINS'

# 修改 .env 文件，设置为前端页面的完整域名
AIC_ALLOWED_ORIGINS=https://your-domain.com

# 重启服务
docker compose down && docker compose up -d
```

### 9.4 CDKEY 激活失败

```bash
# 检查订阅服务器连通性
docker compose exec canvaspro sh -c 'wget -qO- --timeout=5 https://api.ashuoai.com/'

# 如果无法访问，配置代理
# 在 .env 中添加：
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=http://your-proxy:port

# 重启服务
docker compose down && docker compose up -d
```

### 9.5 视频处理报错（opencv/ffmpeg）

```bash
# 验证 opencv 是否正常
docker compose exec canvaspro python -c "import cv2; print(cv2.__version__)"

# 验证 ffmpeg 是否正常
docker compose exec canvaspro ffmpeg -version

# 如果报错则重建镜像
docker compose up -d --build --force-recreate
```

### 9.6 内存溢出（OOM）

```bash
# 查看资源使用
docker stats ai-canvaspro

# 在 docker-compose.yml 中增加内存限制
deploy:
  resources:
    limits:
      memory: "4G"
```

### 9.7 命令行没有任何日志输出

默认情况下 `AIC_LOG_LEVEL=basic`，如果完全看不到 HTTP 请求日志：

```bash
# 1. 检查当前日志级别
docker compose exec canvaspro sh -c 'echo $AIC_LOG_LEVEL'

# 2. 切换为详细日志级别
# 修改 .env 文件：
AIC_LOG_LEVEL=verbose
# 重启：
docker compose down && docker compose up -d

# 3. 查看实时日志
docker compose logs -f

# 4. 日志效果说明：
#    off:     完全静默，无任何 HTTP 请求输出（适合生产环境）
#    basic:   输出格式 "127.0.0.1 - - [17/Jun/2026 20:00:00] "GET / HTTP/1.1" 200 -"
#    verbose: 输出格式 "[2026-06-17 20:00:00] 192.168.1.1 "GET /api/v2/xxx HTTP/1.1" 200 - | UA: Mozilla/5.0..."

# 5. 非 Docker 方式启动时添加命令行参数：
python server.py --log-level=basic
python server.py --log-level=verbose
```

---

## 10. 附录：命令速查表

### 构建

| 操作 | 命令 |
|------|------|
| 构建镜像 | `docker compose build` |
| 无缓存构建 | `docker compose build --no-cache` |
| 构建并启动 | `docker compose up -d --build` |
| 打标签 | `docker tag ai-canvaspro:latest registry.com/ai-canvaspro:v1.0` |
| 推送镜像 | `docker push registry.com/ai-canvaspro:v1.0` |

### 运行

| 操作 | 命令 |
|------|------|
| 启动 | `docker compose up -d` |
| 停止 | `docker compose stop` |
| 重启 | `docker compose restart` |
| 删除 | `docker compose down` |
| 删除+数据卷 | `docker compose down -v` |
| 前台运行 | `docker compose up` |

### 监控

| 操作 | 命令 |
|------|------|
| 查看状态 | `docker compose ps` |
| 查看日志 | `docker compose logs -f` |
| 资源使用 | `docker stats ai-canvaspro` |
| 健康检查 | `docker inspect ai-canvaspro --format='{{json .State.Health}}'` |
| 进入容器 | `docker compose exec canvaspro sh` |

### 维护

| 操作 | 命令 |
|------|------|
| 清理缓存 | `docker builder prune` |
| 清理所有 | `docker system prune -a` |
| 查看镜像 | `docker images ai-canvaspro` |
| 备份数据 | `tar -czf backup.tar.gz ./user ./data` |
| 恢复数据 | `tar -xzf backup.tar.gz -C ./` |
| 更新代码 | `git pull && docker compose up -d --build` |

---

> 📄 相关文档：
> - `DEPLOY.md` - 简明部署说明
> - `.env.example` - 环境变量配置模板

> ⚠️ 技术支持：如遇到本手册未覆盖的问题，请检查 Docker 和项目的日志输出，定位具体错误信息。
