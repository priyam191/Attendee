/**
 * Response time tracking for API performance metrics.
 * Stores last N response times per route for /api/stats (interview demo).
 */
const MAX_SAMPLES_PER_ROUTE = 200;

const store = new Map(); // routeKey -> number[]

function getRouteKey(req) {
  // Normalize dynamic segments for grouping (e.g. /api/courses/123 -> /api/courses/:id)
  const rawPath = req.originalUrl?.split('?')[0] || req.baseUrl + req.path || req.path;
  const method = (req.method || 'GET').toUpperCase();
  const normalized = rawPath
    .replace(/\/[a-f0-9]{24}/gi, '/:id') // MongoDB ObjectId
    .replace(/\/\d+/g, '/:id');
  return `${method} ${normalized}`;
}

function p95(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil(sorted.length * 0.95) - 1;
  return Math.round(sorted[Math.max(0, idx)] * 100) / 100;
}

function avg(arr) {
  if (!arr.length) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return Math.round((sum / arr.length) * 100) / 100;
}

function responseTimeMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    const key = getRouteKey(req);

    if (!store.has(key)) store.set(key, []);
    const times = store.get(key);
    times.push(durationMs);
    if (times.length > MAX_SAMPLES_PER_ROUTE) times.shift();
  });

  next();
}

function getStats() {
  const endpoints = {};
  for (const [route, times] of store.entries()) {
    endpoints[route] = {
      count: times.length,
      avgMs: avg(times),
      p95Ms: p95(times),
    };
  }
  return { endpoints };
}

module.exports = { responseTimeMiddleware, getStats };
