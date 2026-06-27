import React, { useEffect, useState } from 'react'
import { fetchAdminOverview } from '../components/api'
import { useDemoAuth } from '../components/useDemoAuth'

const AdminDashboard = () => {
  const { ready } = useDemoAuth('dept_admin')
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    if (!ready) return
    fetchAdminOverview().then(setOverview)
  }, [ready])

  return (
    <div>
      <div className="topbar">
        <div>
          <p className="tag">Department Admin</p>
          <h1>Department Performance</h1>
        </div>
        <button className="btn">Bulk Export</button>
      </div>

      <div className="metric-grid">
        <div className="card glow">
          <h3>Total Courses</h3>
          <h2>{overview?.totalCourses ?? '--'}</h2>
        </div>
        <div className="card">
          <h3>Total Students</h3>
          <h2>{overview?.totalStudents ?? '--'}</h2>
        </div>
        <div className="card">
          <h3>Avg Success Rate</h3>
          <h2>{overview?.avgSuccessRate ?? '--'}%</h2>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <h3>Course Comparison</h3>
          <div className="chart-area">
            {overview?.courses?.map((course) => (
              <p key={course.name}>
                {course.name} · {course.successRate}%
              </p>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Semester Trends</h3>
          <div className="chart-area">
            {overview?.trends?.map((trend) => (
              <p key={trend.semester}>
                {trend.semester}: {trend.rate}%
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
