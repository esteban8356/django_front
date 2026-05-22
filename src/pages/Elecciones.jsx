import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import styles from './Elecciones.module.css'

export default function Elecciones() {
  const [elecciones, setElecciones] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('elecciones/')
      .then(res => setElecciones(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const estadoClass = (estado) => {
    if (estado === 'activa') return styles.estadoActiva
    if (estado === 'cerrada') return styles.estadoCerrada
    return styles.estadoBorrador
  }

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Bienvenido a las urnas digitales</h1>
          <p>Participa activamente en el proceso electoral. Tu voto es seguro, confidencial y cuenta.</p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNum}>{elecciones.length}</div>
            <div className={styles.heroStatLabel}>Elecciones</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNum}>{elecciones.filter(e => e.estado === 'activa').length}</div>
            <div className={styles.heroStatLabel}>Activas</div>
          </div>
        </div>
      </div>

      <div className={styles.sectionTitle}>
        <span className={styles.dot}></span>
        Procesos electorales disponibles
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando elecciones...</div>
      ) : (
        <div className={styles.grid}>
          {elecciones.map(eleccion => (
            <div className={styles.card} key={eleccion.id}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>{eleccion.nombre}</div>
                <span className={`${styles.estado} ${estadoClass(eleccion.estado)}`}>
                  {eleccion.estado}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardDesc}>{eleccion.descripcion}</p>
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Inicio</span>
                    {formatFecha(eleccion.fecha_inicio)}
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Cierre</span>
                    {formatFecha(eleccion.fecha_cierre)}
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button
                  className={styles.btnVotar}
                  onClick={() => navigate(`/votar/${eleccion.id}`)}
                  disabled={eleccion.estado !== 'activa'}
                >
                  {eleccion.estado === 'activa' ? 'Votar ahora' : 'No disponible'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}