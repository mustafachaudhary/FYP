import React, { useEffect, useState } from 'react'
import { fetchCourses, fetchCourseSummary, fetchCourseStudents } from '../components/api'
import { useDemoAuth } from '../components/useDemoAuth'

const CoursesPage = () => {
  const { ready } = useDemoAuth()
  const [courses, setCourses] = useState([])
  const [selected, setSelected] = useState(null)
  const [summary, setSummary] = useState(null)
  const [students, setStudents] = useState([])

  useEffect(() => {
    if (!ready) return
    fetchCourses().then((data) => {
      setCourses(data)
      if (data[0]) setSelected(data[0])
    })
  }, [ready])

  useEffect(() => {
    if (!selected) return
    fetchCourseSummary(selected.id).then(setSummary)
    fetchCourseStudents(selected.id).then(setStudents)
  }, [selected])

  return (
    <div>
      <div className="topbar">
        <div>
          <p className="tag">Courses</p>
          <h1>Course Health Snapshot</h1>
        </div>
        <button className="btn ghost">New Course Import</button>
      </div>

      <div className="section-grid">
        <div className="card">
          <h3>Active Courses</h3>
          <div>
            {courses.map((course) => (
              <div
                key={course.id}
                className="card"
                style={{ marginTop: 12, cursor: 'pointer', border: course.id === selected?.id ? '1px solid var(--accent)' : '1px solid transparent' }}
                onClick={() => setSelected(course)}
              >
                <h4>{course.name}</h4>
                <p className="tag">{course.semester}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Course Focus</h3>
          <p className="tag">{selected?.name || 'Select a course'}</p>
          <div className="metric-grid" style={{ marginTop: 16 }}>
            <div className="card">
              <h4>Total Students</h4>
              <h2>{summary?.totalStudents ?? '--'}</h2>
            </div>
            <div className="card">
              <h4>Avg Engagement</h4>
              <h2>{summary?.avgEngagement ?? '--'}%</h2>
            </div>
            <div className="card">
              <h4>At-Risk</h4>
              <h2>{summary?.atRiskStudents ?? '--'}</h2>
            </div>
          </div>
          <div className="action-row">
            <button className="btn">Run Pattern Mining</button>
            <button className="btn secondary">Generate Report</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>At-Risk Watchlist</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Engagement</th>
              <th>Risk</th>
              <th>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {students.filter((s) => s.riskLevel !== 'low').slice(0, 6).map((row) => (
              <tr key={row.studentId}>
                <td>{row.studentId}</td>
                <td>{row.engagement}%</td>
                <td><span className={`badge ${row.riskLevel}`}>{row.riskLevel}</span></td>
                <td>Recommend revisiting reading material before quiz.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CoursesPage
