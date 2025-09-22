const { createProxyMiddleware } = require("http-proxy-middleware");

console.log("🚀 setupProxy.js для FastAPI загружен!");

module.exports = function (app) {
  // Middleware для установки CSP заголовка
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; style-src 'self' https://www.gstatic.com; script-src 'self';"
    );
    next();
  });

  // ИСПРАВЛЕНО: Отдельный прокси для /tasks с правильным порядком
  app.use(
    "/tasks",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
      logLevel: "debug",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Tasks запрос:`);
        console.log(`   Frontend URL: ${req.originalUrl}`);
        console.log(`   Backend URL: http://localhost:8000${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ Tasks ответ: ${proxyRes.statusCode}`);
        console.log(`   Content-Type: ${proxyRes.headers["content-type"]}`);
      },
      onError: (err, req, res) => {
        console.error("❌ Tasks прокси ошибка:", err);
        res.status(500).json({ error: "Tasks proxy error" });
      },
    })
  );

  // Прокси для /users
  app.use(
    "/users",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
      logLevel: "debug",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Users запрос:`);
        console.log(`   Frontend URL: ${req.originalUrl}`);
        console.log(`   Backend URL: http://localhost:8000${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ Users ответ: ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error("❌ Users прокси ошибка:", err);
        res.status(500).json({ error: "Users proxy error" });
      },
    })
  );

  // Прокси для /login
  app.use(
    "/login",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
      logLevel: "debug",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Login запрос:`);
        console.log(`   Frontend URL: ${req.originalUrl}`);
        console.log(`   Backend URL: http://localhost:8000${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ Login ответ: ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error("❌ Login прокси ошибка:", err);
        res.status(500).json({ error: "Login proxy error" });
      },
    })
  );

  // Прокси для /api (оставляем как было)
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
      logLevel: "debug",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 API запрос:`);
        console.log(`   Frontend URL: ${req.originalUrl}`);
        console.log(
          `   Backend URL: http://localhost:8000${req.url.replace("/api", "")}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ API ответ: ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error("❌ API прокси ошибка:", err);
        res.status(500).json({ error: "API proxy error" });
      },
    })
  );
};
