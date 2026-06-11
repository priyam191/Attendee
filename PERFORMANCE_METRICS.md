# Showing performance numbers in interviews

This project includes **measurable performance features** so you can cite real numbers.

---

## 1. API response times (live in the app)

**What:** The server tracks response time for every `/api/*` request and exposes stats at `GET /api/stats`.

**How to show interviewers:**

1. Start the server: `cd server && npm start`
2. Start the client: `cd client && npm start`
3. Use the app: log in, open dashboards, view attendance, open a course, etc.
4. In the navbar, click **Performance** (or go to `/performance`).
5. The page shows **per-endpoint metrics**: request count, **average response time (ms)**, and **P95 (ms)**.

**Example resume line:**  
*"Implemented response-time middleware and a stats endpoint; key APIs average under 150ms and P95 under 300ms."*

Use the actual numbers from your Performance page after a short demo.

---

## 2. Bundle size (code-splitting)

**What:** Route-level code-splitting with `React.lazy()` so each major screen loads in its own chunk. The main bundle is smaller and initial load is faster.

**How to get numbers:**

1. From project root: `cd client`
2. Run: `npm run build`
3. In the build output, look for the table of file sizes, e.g.:
   - `main.[hash].js` – core app (smaller because routes are split out)
   - `[number].[hash].js` – lazy chunks (e.g. TeacherDashboard, StudentDashboard, etc.)

**Example resume line:**  
*"Reduced initial bundle size by ~X% using React.lazy() for route-level code-splitting (run build and compare main chunk vs total)."*

To get a concrete “X%”: run `npm run build` once, note the size of `main.*.js` (or “main” in the summary). If you have an old build without code-splitting, compare; otherwise cite the main chunk size and that “lazy chunks load on demand.”

---

## 3. Quick demo script for interviewers

1. Open the app and go to **Performance** (no login needed).
2. Show the table – if empty: “Let me generate some traffic,” then log in, open dashboard, view a course, come back to Performance and refresh.
3. Point out: “We track every API call; here’s average and P95 response time per endpoint.”
4. For frontend: “We use React.lazy() so each route is a separate chunk; I can run `npm run build` and show the chunk sizes.”

You can use the exact numbers from your Performance page and build output in your resume bullets and in the interview.
