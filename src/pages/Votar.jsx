import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import styles from './Votar.module.css'

const COLORES = ['#1a3a5c', '#8b1a1a', '#c49a2a', '#2d6a4f', '#5c1a5c', '#1a5c5c']

export default function Votar() {
  const { eleccionId } = useParams()
  const navigate = useNavigate()
  const [eleccion, setEleccion] = useState(null)
  const [candidatos, setCandidatos] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [loading, setLoading] = useState(true)
  const [votando, setVotando] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get(`elecciones/${eleccionId}/`),
      api.get(`candidatos/?eleccion=${eleccionId}`)
    ])
      .then(([eleccionRes, candidatosRes]) => {
        setEleccion(eleccionRes.data)
        setCandidatos(candidatosRes.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [eleccionId])

  const getIniciales = (nombre) => {
    return nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  }

  const handleVotar = async () => {
    if (!seleccionado) {
      setMensaje({ texto: 'Por favor selecciona un candidato', tipo: 'error' })
      return
    }
    setVotando(true)
    try {
      await api.post('votos/', {
        eleccion: parseInt(eleccionId),
        candidato: seleccionado
      })
      setMensaje({ texto: '¡Voto emitido exitosamente! Gracias por participar.', tipo: 'exito' })
      setTimeout(() => navigate('/elecciones'), 2500)
    } catch (err) {
      const errorMsg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || 'Ocurrió un error al emitir el voto.'
      setMensaje({ texto: errorMsg, tipo: 'error' })
    } finally {
      setVotando(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando candidatos...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate('/elecciones')}>
        ← Volver a elecciones
      </button>

      {eleccion && (
        <div className={styles.header}>
          <h2>{eleccion.nombre}</h2>
          <p>Selecciona un candidato y confirma tu voto. Esta acción no se puede deshacer.</p>
        </div>
      )}

      {mensaje.texto && (
        <div className={`${styles.mensaje} ${mensaje.tipo === 'exito' ? styles.exito : styles.error}`}>
          {mensaje.texto}
        </div>
      )}

      <div className={styles.sectionTitle}>
        <span className={styles.dot}></span>
        Candidatos disponibles
      </div>

      <div className={styles.grid}>
        {candidatos.map((candidato, index) => (
          <div
            key={candidato.id}
            className={`${styles.card} ${seleccionado === candidato.id ? styles.selected : ''}`}
            onClick={() => setSeleccionado(candidato.id)}
          >
            {seleccionado === candidato.id && (
              <div className={styles.checkmark}>✓</div>
            )}
            <div
              className={styles.avatar}
              style={{ background: COLORES[index % COLORES.length] }}
            >
              {getIniciales(candidato.nombre)}
            </div>
            <div className={styles.nombre}>{candidato.nombre}</div>
            {candidato.propuesta && (
              <div className={styles.propuesta}>{candidato.propuesta}</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.btnConfirmar}
          onClick={handleVotar}
          disabled={!seleccionado || votando}
        >
          {votando ? 'Registrando voto...' : 'Confirmar voto'}
        </button>
      </div>
    </div>
  )
}