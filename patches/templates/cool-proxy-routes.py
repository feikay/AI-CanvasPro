# === COOL API 代理路由 ===
# 添加到 server.py 中，建议放在其他 @app.post 路由之后

# POST /api/v2/proxy/cool — 提交生成任务到 COOL API
@app.post("/api/v2/proxy/cool")
async def proxy_cool_submit(request: Request):
    """代理转发 COOL submit 请求: POST /v1/cool/generate"""
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    api_url = str(body.pop("apiUrl", "")).strip()
    api_key = str(body.pop("apiKey", "")).strip()
    if not api_url:
        raise HTTPException(status_code=400, detail="Missing apiUrl")
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    payload = {k: v for k, v in body.items()}
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(api_url, json=payload, headers=headers)
            return JSONResponse(content=resp.json(), status_code=resp.status_code)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"COOL API proxy error: {str(e)}")

# GET /api/v2/proxy/cool — 轮询 COOL 任务状态
@app.get("/api/v2/proxy/cool")
async def proxy_cool_poll(request: Request):
    """代理转发 COOL 轮询请求: GET /v1/cool/task/{taskId}"""
    api_url = request.query_params.get("apiUrl", "").strip()
    api_key = request.query_params.get("apiKey", "").strip()
    if not api_url:
        raise HTTPException(status_code=400, detail="Missing apiUrl")
    headers = {}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(api_url, headers=headers)
            return JSONResponse(content=resp.json(), status_code=resp.status_code)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"COOL poll proxy error: {str(e)}")

# === COOL 代理路由结束 ===
