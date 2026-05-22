import { useEffect, useState } from 'react'
import api from '../../api/axios'
import AdminLayout from '../../components/AdminLayout'
import styles from './AdminElecciones.module.css'

const EMPTY_FORM = {
  nombre: '', descripcion: '', fecha_inicio: '', fecha_cierre: '', estado: 'borrador'
}

export default function AdminElecciones() {
  const [elecciones, setElecciones] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editando, setEditando] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  const cargar = () => {
    api.get('elecciones/')
      .then(res => setElecciones(res.data))
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
      if (editando) {
        await api.put(`elecciones/${editando}/`, form)
        mostrarMensaje('Elección actualizada correctamente')
      } else {
        await api.post('elecciones/', form)
        mostrarMensaje('Elección creada correctamente')
      }
      setForm(EMPTY_FORM)
      setEditando(null)
      setShowForm(false)
      cargar()
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || 'Error al guardar la elección'
      mostrarMensaje(msg, 'error')
    }
  }

  const handleEditar = (eleccion) => {
    setForm({
      nombre: eleccion.nombre,
      descripcion: eleccion.descripcion,
      fecha_inicio: eleccion.fecha_inicio?.slice(0, 16),
      fecha_cierre: eleccion.fecha_cierre?.slice(0, 16),
      estado: eleccion.estado,
    })
    setEditando(eleccion.id)
    setShowForm(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta elección?')) return
    try {
      await api.delete(`elecciones/${id}/`)
      mostrarMensaje('Elección eliminada correctamente')
      cargar()
    } catch (err) {
      mostrarMensaje('Error al eliminar la elección', 'error')
    }
  }

  const handleCancelar = () => {
    setForm(EMPTY_FORM)
    setEditando(null)
    setShowForm(false)
  }

  const estadoClass = (estado) => {
    if (estado === 'activa') return styles.estadoActiva
    if (estado === 'cerrada') return styles.estadoCerrada
    return styles.estadoBorrador
  }

  return (
    <AdminLayout>
      <div className={styles.header}>
        <div>
          <h2 className={styles.titulo}>Gestión de Elecciones</h2>
          <p className={styles.subtitulo}>Crea, edita y administra los procesos electorales</p>
        </div>
        {!showForm && (
          <button className={styles.btnNuevo} onClick={() => setShowForm(true)}>
            + Nueva Elección
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
          <h3 className={styles.formTitulo}>
            {editando ? 'Editar Elección' : 'Nueva Elección'}
          </h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Nombre de la elección"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select
                  className={styles.input}
                  value={form.estado}
                  onChange={e => setForm({ ...form, estado: e.target.value })}
                >
                  <option value="borrador">Borrador</option>
                  <option value="activa">Activa</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fecha de inicio</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={form.fecha_inicio}
                  onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fecha de cierre</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={form.fecha_cierre}
                  onChange={e => setForm({ ...form, fecha_cierre: e.target.value })}
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Descripción de la elección"
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                  required
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancelar} onClick={handleCancelar}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnGuardar}>
                {editando ? 'Actualizar' : 'Crear Elección'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Cargando elecciones...</div>
      ) : (
        <div className={styles.tabla}>
          <div className={styles.tablaHeader}>
            <span>Nombre</span>
            <span>Estado</span>
            <span>Fecha inicio</span>
            <span>Fecha cierre</span>
            <span>Acciones</span>
          </div>
          {elecciones.length === 0 ? (
            <div className={styles.empty}>No hay elecciones registradas aún.</div>
          ) : (
            elecciones.map(e => (
              <div key={e.id} className={styles.tablaRow}>
                <span className={styles.rowNombre}>{e.nombre}</span>
                <span><span className={`${styles.estado} ${estadoClass(e.estado)}`}>{e.estado}</span></span>
                <span className={styles.rowFecha}>{new Date(e.fecha_inicio).toLocaleDateString('es-CO')}</span>
                <span className={styles.rowFecha}>{new Date(e.fecha_cierre).toLocaleDateString('es-CO')}</span>
                <span className={styles.rowAcciones}>
                  <button className={styles.btnEditar} onClick={() => handleEditar(e)}>Editar</button>
                  <button className={styles.btnEliminar} onClick={() => handleEliminar(e.id)}>Eliminar</button>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  )
}