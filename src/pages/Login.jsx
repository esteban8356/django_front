import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import api from '../api/axios'
import styles from './Login.module.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const mensajeExito = location.state?.mensaje

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('auth/login/', { username, password })
      localStorage.setItem('token', response.data.access)
      localStorage.setItem('username', username)

      const perfilRes = await api.get('auth/perfil/')
      localStorage.setItem('is_staff', perfilRes.data.is_staff)

      if (perfilRes.data.is_staff) {
        navigate('/admin/elecciones')
      } else {
        navigate('/elecciones')
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 3H6C4.9 3 4 3.9 4 5v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h6v2zm4-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h1>Sistema de Votación</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        {mensajeExito && <div className={styles.exito}>{mensajeExito}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Usuario</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className={styles.btnLogin} type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className={styles.link}>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  )
}