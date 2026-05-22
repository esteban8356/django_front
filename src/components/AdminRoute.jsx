import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token')
  const isStaff = localStorage.getItem('is_staff') === 'true'

  if (!token) return <Navigate to="/login" />
  if (!isStaff) return <Navigate to="/elecciones" />

  return children
}