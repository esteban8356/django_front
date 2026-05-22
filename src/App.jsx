import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Elecciones from './pages/Elecciones'
import Votar from './pages/Votar'
import Resultados from './pages/Resultados'
import AdminElecciones from './pages/admin/AdminElecciones'
import AdminCandidatos from './pages/admin/AdminCandidatos'
import AdminVotantes from './pages/admin/AdminVotantes'
import AdminAuditoria from './pages/admin/AdminAuditoria'
import './index.css'
import styles from './App.module.css'

function Tabs() {
  const navigate = useNavigate()
  const location = useLocation()
  const tabs = [
    { label: 'Elecciones', path: '/elecciones' },
    { label: 'Resultados', path: '/resultados' },
  ]
  return (
    <div className={styles.tabs}>
      {tabs.map(tab => (
        <div
          key={tab.path}
          className={`${styles.tab} ${location.pathname === tab.path ? styles.tabActive : ''}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isVotar = location.pathname.startsWith('/votar')
  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && !isVotar && <Tabs />}
      {children}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/elecciones" element={<PrivateRoute><Layout><Elecciones /></Layout></PrivateRoute>} />
        <Route path="/votar/:eleccionId" element={<PrivateRoute><Layout><Votar /></Layout></PrivateRoute>} />
        <Route path="/resultados" element={<PrivateRoute><Layout><Resultados /></Layout></PrivateRoute>} />
        <Route path="/admin/elecciones" element={<AdminRoute><AdminElecciones /></AdminRoute>} />
        <Route path="/admin/candidatos" element={<AdminRoute><AdminCandidatos /></AdminRoute>} />
        <Route path="/admin/votantes" element={<AdminRoute><AdminVotantes /></AdminRoute>} />
        <Route path="/admin/auditoria" element={<AdminRoute><AdminAuditoria /></AdminRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}