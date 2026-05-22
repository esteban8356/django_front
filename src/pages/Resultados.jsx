import { useEffect, useState } from 'react'
import api from '../api/axios'
import styles from './Resultados.module.css'

export default function Resultados() {
  const [elecciones, setElecciones] = useState([])
  const [eleccionSeleccionada, setEleccionSeleccionada] = useState(null)
  const [resultados, setResultados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingResultados, setLoadingResultados] = useState(false)

  useEffect(() => {
    api.get('elecciones/')
      .then(res => {
        setElecciones(res.data)
        if (res.data.length > 0) {
          setEleccionSeleccionada(res.data[0].id)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!eleccionSeleccionada) return
    setLoadingResultados(true)
    api.get(`resultados/${eleccionSeleccionada}/`)
      .then(res => setResultados(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoadingResultados(false))
  }, [eleccionSeleccionada])

  const estadoClass = (estado) => {
    if (estado === 'activa') return styles.estadoActiva
    if (estado === 'cerrada') return styles.estadoCerrada
    return styles.estadoBorrador
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando elecciones...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.sectionTitle}>
        <span className={styles.dot}></span>
        Resultados Electorales
      </div>

      <div className={styles.selector}>
        <label className={styles.selectorLabel}>Selecciona una elección</label>
        <select
          className={styles.select}
          value={eleccionSeleccionada || ''}
          onChange={e => setEleccionSeleccionada(Number(e.target.value))}
        >
          {elecciones.map(e => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
      </div>

      {loadingResultados ? (
        <div className={styles.loading}>Cargando resultados...</div>
      ) : resultados && (
        <>
          {/* Stats generales */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{resultados.total_votos_emitidos}</div>
              <div className={styles.statLabel}>Votos emitidos</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{resultados.total_votantes_habilitados}</div>
              <div className={styles.statLabel}>Votantes habilitados</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{resultados.participacion}%</div>
              <div className={styles.statLabel}>Participación</div>
            </div>
            <div className={styles.statCard}>
              <span className={`${styles.estado} ${estadoClass(resultados.estado)}`}>
                {resultados.estado}
              </span>
              <div className={styles.statLabel}>Estado</div>
            </div>
          </div>

          {/* Resultados por candidato */}
          <div className={styles.subtitulo}>
            <span className={styles.dot}></span>
            Resultados por candidato
          </div>

          {resultados.resultados.length === 0 ? (
            <div className={styles.empty}>No hay votos registrados aún.</div>
          ) : (
            <div className={styles.lista}>
              {resultados.resultados.map((r, i) => (
                <div key={i} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemNombre}>
                      {i === 0 && <span className={styles.ganador}>🥇 </span>}
                      {i === 1 && <span>🥈 </span>}
                      {i === 2 && <span>🥉 </span>}
                      {r.candidato_nombre}
                    </div>
                    <span className={styles.itemPct}>{r.porcentaje}%</span>
                  </div>
                  <div className={styles.barraBg}>
                    <div
                      className={styles.barraFill}
                      style={{ width: `${r.porcentaje}%` }}
                    ></div>
                  </div>
                  <div className={styles.itemVotos}>{r.votos} votos emitidos</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}