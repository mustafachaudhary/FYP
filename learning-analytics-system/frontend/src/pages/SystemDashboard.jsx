import React, { useEffect, useState } from 'react'
import { fetchSystemHealth, fetchSystemJobs, fetchSystemLogs } from '../components/api'
import { useDemoAuth } from '../components/useDemoAuth'

const SystemDashboard = () => {
  const { ready } = useDemoAuth('admin')
  const [health, setHealth] = useState(null)
  const [jobs, setJobs] = useState([])
  const [logs, setLogs] = useState([])

  useEffect(() => {
    if (!ready) return
    fetchSystemHealth().then(setHealth)
    fetchSystemJobs().then(setJobs)
    fetchSystemLogs().then(setLogs)
  }, [ready])

  return (
    <div>
      <div className="topbar">
        <div>
          <p className="tag">System Admin</p>
          <h1>Infrastructure Control</h1>
        </div>
        <div className="action-row">
          <button className="btn secondary">Retrain Models</button>
          <button className="btn">Restart Services</button>
        </div>
      </div>

      <div className="metric-grid">
        {health && (
          <>
            <div className="card">
              <h3>API Server</h3>
              <h2>{health.api}</h2>
            </div>
            <div className="card">
              <h3>Database</h3>
              <h2>{health.database}</h2>
            </div>
            <div className="card">
              <h3>Redis Cache</h3>
              <h2>{health.cache}</h2>
            </div>
          </>
        )}
      </div>

      <div className="section-grid">
        <div className="card">
          <h3>Celery Job Queue</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.name}>
                  <td>{job.name}</td>
                  <td>{job.status}</td>
                  <td>{job.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Recent Logs</h3>
          <div className="chart-area">
            {logs.map((log, idx) => (
              <p key={`${log}-${idx}`}>{log}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemDashboard
