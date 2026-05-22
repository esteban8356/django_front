import { useNavigate, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.css'

const menuItems = [
  { label: 'Elecciones', path: '/admin/elecciones', icon: '🗳️' },
  { label: 'Candidatos', path: '/admin/candidatos', icon: '👤' },
  { label: 'Votantes', path: '/admin/votantes', icon: '👥' },
  { label: 'Auditoría', path: '/admin/auditoria', icon: '📊' },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.sidebarIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <div className={styles.sidebarTitle}>Panel Admin</div>
            <div className={styles.sidebarSub}>Sistema de Votación</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {menuItems.map(item => (
            <div
              key={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.navItemActive : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.btnVolver} onClick={() => navigate('/elecciones')}>
            ← Volver al inicio
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}