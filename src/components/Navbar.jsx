import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Usuario'
  const isStaff = localStorage.getItem('is_staff') === 'true'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('is_staff')
    navigate('/login')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.icon}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 3H6C4.9 3 4 3.9 4 5v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h6v2zm4-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <div>
          <div className={styles.title}>Sistema de Votación</div>
          <div className={styles.subtitle}>Plataforma Electoral Digital</div>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.badgeUser}>{username}</span>
        {isStaff && (
          <button
            className={styles.btnAdmin}
            onClick={() => navigate('/admin/elecciones')}
          >
            Panel Admin
          </button>
        )}
        <button className={styles.btnLogout} onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  )
}