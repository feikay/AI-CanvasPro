# AI CanvasPro 容器化部署指南

## 快速开始

### 1. 构建并启动

```bash
# 进入项目目录
cd AI-CanvasPro

# 构建镜像并启动服务
docker compose up -d --build
```

启动后访问 `http://localhost:8777` 即可使用。

### 2. 查看日志

```bash
docker compose logs -f
```

### 3. 停止服务

```bash
docker compose down
```

### 4. 更新部署

```bash
# 拉取最新代码后重新构建
docker compose down
docker compose up -d --build
```

---

## 环境变量配置

在项目目录创建 `.env` 文件进行个性化配置：

```bash
# ====== 端口配置 ======
AICANVAS_PORT=8777

# ====== 安全配置 ======
# 部署到云端时，替换为你的实际域名，多个用逗号分隔
AIC_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# 可选：设置访问令牌，启用后需要在请求中携带
# AIC_LOCAL_TOKEN=your-secret-token

# ====== 代理配置（如需科学上网访问授权服务器）=======
# HTTP_PROXY=http://your-proxy:port
# HTTPS_PROXY=http://your-proxy:port
```

---

## 数据持久化

以下目录通过 Docker Volume 挂载到宿主机，确保数据不丢失：

| 容器内路径 | 宿主机路径 | 说明 |
|-----------|-----------|------|
| `/app/user/` | `./user/` | 画布项目、快捷键、应用设置、API Key 配置 |
| `/app/data/uploads/` | `./data/uploads/` | 用户上传的文件 |
| `/app/data/output/` | `./data/output/` | 生成的输出文件 |

---

## 生产环境部署

### 配合 Nginx 反向代理

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # 文件上传大小限制
    client_max_body_size 500m;

    location / {
        proxy_pass http://127.0.0.1:8777;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持（如有）
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 超时设置
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}

# HTTP 自动跳转 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
```

### Docker Compose + Nginx 一体化部署

将以下内容追加到 `docker-compose.yml`：

```yaml
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
```

---

## 资源需求

| 资源 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 1 核 | 2 核以上 |
| 内存 | 1 GB | 2 GB 以上 |
| 磁盘 | 2 GB（不含用户数据） | 10 GB 以上（SSD） |

> 注意：视频处理任务（scenedetect、opencv）会消耗较多 CPU 和内存。

---

## 常见问题

### Q: 容器启动后无法从外部访问？
A: 确保已设置 `AIC_LAN_MODE=1`，且防火墙放行了对应端口。

### Q: 跨域请求被拦截？
A: 正确设置 `AIC_ALLOWED_ORIGINS` 环境变量为你前端页面的域名。

### Q: CDKEY 激活失败？
A: 确保服务器能正常访问 `https://api.ashuoai.com`，必要时配置 HTTP_PROXY。

### Q: 如何备份数据？
A: 备份宿主机的 `user/` 和 `data/` 目录即可。
