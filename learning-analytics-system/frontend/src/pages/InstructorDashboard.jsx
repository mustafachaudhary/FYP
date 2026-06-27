import React, { useEffect, useMemo, useState } from 'react'
import { fetchCourseSummary, fetchCourseStudents, fetchCourses, fetchCoursePaths } from '../components/api'
import { useDemoAuth } from '../components/useDemoAuth'

const InstructorDashboard = () => {
  const { ready, error } = useDemoAuth()
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState(null)
  const [summary, setSummary] = useState(null)
  const [students, setStudents] = useState([])
  const [paths, setPaths] = useState({ nodes: [], links: [] })

  useEffect(() => {
    if (!ready) return
    fetchCourses().then((data) => {
      setCourses(data)
      if (data[0]) setCourseId(data[0].id)
    })
  }, [ready])

  useEffect(() => {
    if (!courseId) return
    fetchCourseSummary(courseId).then(setSummary)
    fetchCourseStudents(courseId).then(setStudents)
    fetchCoursePaths(courseId).then(setPaths)
  }, [courseId])

  const topLinks = useMemo(() => {
    return [...paths.links].sort((a, b) => b.value - a.value).slice(0, 5)
  }, [paths])
  const nodeMap = useMemo(() => {
    const map = new Map()
    paths.nodes.forEach((node) => map.set(node.id, node.name))
    return map
  }, [paths])

  if (error) {
    return <div className="card">Unable to authenticate. Start the backend and seed the database.</div>
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <p className="tag">Instructor Dashboard</p>
          <h1>Learning Path Insights</h1>
        </div>
        <div>
          <select value={courseId || ''} onChange={(e) => setCourseId(Number(e.target.value))}>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} · {course.semester}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="metric-grid">
        <div className="card glow">
          <h3>Total Students</h3>
          <h2>{summary?.totalStudents ?? '--'}</h2>
          <p className="tag">Active this term</p>
        </div>
        <div className="card">
          <h3>Avg Engagement</h3>
          <h2>{summary?.avgEngagement ?? '--'}%</h2>
          <p className="tag">Last 7 days</p>
        </div>
        <div className="card">
          <h3>At-Risk Students</h3>
          <h2>{summary?.atRiskStudents ?? '--'}</h2>
          <p className="tag">Needs follow up</p>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <h3>Student Roster</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Last Activity</th>
                <th>Engagement</th>
                <th>Risk</th>
                <th>Est Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 8).map((row) => (
                <tr key={row.studentId}>
                  <td>{row.studentId}</td>
                  <td>{row.lastActivity}</td>
                  <td>{row.engagement}%</td>
                  <td>
                    <span className={`badge ${row.riskLevel}`}>
                      {row.riskLevel}
                    </span>
                  </td>
                  <td>{row.estimatedGrade}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="action-row">
            <button className="btn">Export Report</button>
            <button className="btn secondary">Send Alert</button>
          </div>
        </div>

        <div className="card">
          <h3>Learning Path Highlights</h3>
          <div className="chart-area">
            <p className="tag">Top transitions</p>
            {topLinks.map((link, idx) => (
              <p key={`${link.source}-${link.target}-${idx}`}>
                {nodeMap.get(link.source) || link.source} → {nodeMap.get(link.target) || link.target} · {link.value} students
              </p>
            ))}
            {!topLinks.length && <p>No path data available yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard
