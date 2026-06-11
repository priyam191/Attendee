import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './PerformanceStats.css';

/**
 * Demo page for interviewers: shows API response time metrics (avg, p95, request count).
 * Use a few app flows (login, open dashboard, view attendance) then open this page to see numbers.
 */
const PerformanceStats = () => {
  const { apiUrl } = useContext(AuthContext);
  const baseUrl = apiUrl || 'https://attendee-6ox7.onrender.com';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/stats`);
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Could not load API stats. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [baseUrl]);

  if (loading) return <div className="perf-loading">Loading performance stats…</div>;
  if (error) return <div className="perf-error">{error}</div>;

  const entries = stats?.endpoints ? Object.entries(stats.endpoints) : [];
  const sorted = entries.sort((a, b) => (b[1].count || 0) - (a[1].count || 0));

  return (
    <div className="performance-stats">
      <div className="perf-header">
        <Link to="/">← Back to Home</Link>
        <h1>Performance &amp; API Metrics</h1>
        <p className="perf-subtitle">Use this page in demos to show measurable impact (response times, request counts).</p>
      </div>

      <section className="perf-section">
        <h2>API response times</h2>
        <p className="perf-desc">Average and 95th percentile response time (ms) per endpoint. Data resets on server restart.</p>
        {sorted.length === 0 ? (
          <p className="perf-empty">No API requests recorded yet. Use the app (login, dashboards, attendance) then refresh this page.</p>
        ) : (
          <table className="perf-table">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Requests</th>
                <th>Avg (ms)</th>
                <th>P95 (ms)</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(([route, { count, avgMs, p95Ms }]) => (
                <tr key={route}>
                  <td><code>{route}</code></td>
                  <td>{count}</td>
                  <td>{avgMs}</td>
                  <td>{p95Ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="perf-section">
        <h2>Frontend: bundle size</h2>
        <p className="perf-desc">Route-level code-splitting is enabled (React.lazy). Run <code>npm run build</code> in the client folder and check the build output for chunk sizes and total bundle size.</p>
      </section>
    </div>
  );
};

export default PerformanceStats;
