import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import InstructorDashboard from './pages/InstructorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import SystemDashboard from './pages/SystemDashboard'
import CoursesPage from './pages/CoursesPage'

const App = () => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Learning Analytics</h2>
        <div className="nav-links">
          <NavLink className="nav-link" to="/">Instructor</NavLink>
          <NavLink className="nav-link" to="/courses">Courses</NavLink>
          <NavLink className="nav-link" to="/admin">Dept Admin</NavLink>
          <NavLink className="nav-link" to="/system">System Admin</NavLink>
        </div>
      </aside>
      <main className="page-content">
        <Routes>
          <Route path="/" element={<InstructorDashboard />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/system" element={<SystemDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
