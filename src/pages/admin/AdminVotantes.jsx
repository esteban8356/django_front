import { useEffect, useState } from 'react'
import api from '../../api/axios'
import AdminLayout from '../../components/AdminLayout'
import styles from './AdminElecciones.module.css'

const EMPTY_FORM = { usuario: '', eleccion: '', habilitado: true }

export default function AdminVotantes() {
  const [votantes, setVotantes] = useState([])
  const [elecciones, setElecciones] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  const cargar = () => {
    Promise.all([
      api.get('votantes/'),
      api.get('elecciones/'),
      api.get('auth/usuarios/'),
    ])
      .then(([vRes, eRes, uRes]) => {
        setVotantes(vRes.data)
        setElecciones(eRes.data)
        setUsuarios(uRes.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('votantes/', form)
      mostrarMensaje('Votante habilitado correctamente')
      setForm(EMPTY_FORM)
      setShowForm(false)
      cargar()
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || 'Error al habilitar el votante'
      mostrarMensaje(msg, 'error')
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas deshabilitar este votante?')) return
    try {
      await api.delete(`votantes/${id}/`)
      mostrarMensaje('Votante eliminado correctamente')
      cargar()
    } catch (err) {
      mostrarMensaje('Error al eliminar el votante', 'error')
    }
  }

  const getNombre = (id, lista) => {
    const item = lista.find(i => i.id === id)
    return item ? (item.username || item.nombre) : '-'
  }

  return (
    <AdminLayout>
      <div className={styles.header}>
        <div>
          <h2 className={styles.titulo}>Gestión de Votantes</h2>
          <p className={styles.subtitulo}>Habilita los votantes por elección</p>
        </div>
        {!showForm && (
          <button className={styles.btnNuevo} onClick={() => setShowForm(true)}>
            + Habilitar Votante
          </button>
        )}
      </div>

      {mensaje.texto && (
        <div className={`${styles.mensaje} ${mensaje.tipo === 'error' ? styles.error : styles.exito}`}>
          {mensaje.texto}
        </div>
      )}

      {showForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitulo}>Habilitar Votante</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Usuario</label>
                <select
                  className={styles.input}
                  value={form.usuario}
                  onChange={e => setForm({ ...form, usuario: e.target.value })}
                  required
                >
                  <option value="">Selecciona un usuario</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Elección</label>
                <select
                  className={styles.input}
                  value={form.eleccion}
                  onChange={e => setForm({ ...form, eleccion: e.target.value })}
                  required
                >
                  <option value="">Selecciona una elección</option>
                  {elecciones.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancelar} onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnGuardar}>
                Habilitar Votante
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Cargando votantes...</div>
      ) : (
        <div className={styles.tabla}>
          <div className={styles.tablaHeader} style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr' }}>
            <span>Usuario</span>
            <span>Elección</span>
            <span>Estado</span>
            <span>Acciones</span>
          </div>
          {votantes.length === 0 ? (
            <div className={styles.empty}>No hay votantes habilitados aún.</div>
          ) : (
            votantes.map(v => (
              <div key={v.id} className={styles.tablaRow} style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr' }}>
                <span className={styles.rowNombre}>{getNombre(v.usuario, usuarios)}</span>
                <span className={styles.rowFecha}>{getNombre(v.eleccion, elecciones)}</span>
                <span>
                  <span className={`${styles.estado} ${v.habilitado ? styles.estadoActiva : styles.estadoCerrada}`}>
                    {v.habilitado ? 'Habilitado' : 'Deshabilitado'}
                  </span>
                </span>
                <span className={styles.rowAcciones}>
                  <button className={styles.btnEliminar} onClick={() => handleEliminar(v.id)}>Eliminar</button>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  )
}