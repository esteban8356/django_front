import { useEffect, useState } from 'react'
import api from '../../api/axios'
import AdminLayout from '../../components/AdminLayout'
import styles from './AdminElecciones.module.css'

const EMPTY_FORM = { nombre: '', descripcion: '', propuesta: '', eleccion: '' }

export default function AdminCandidatos() {
  const [candidatos, setCandidatos] = useState([])
  const [elecciones, setElecciones] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editando, setEditando] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  const cargar = () => {
    Promise.all([api.get('candidatos/'), api.get('elecciones/')])
      .then(([cRes, eRes]) => {
        setCandidatos(cRes.data)
        setElecciones(eRes.data)
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
      if (editando) {
        await api.put(`candidatos/${editando}/`, form)
        mostrarMensaje('Candidato actualizado correctamente')
      } else {
        await api.post('candidatos/', form)
        mostrarMensaje('Candidato creado correctamente')
      }
      setForm(EMPTY_FORM)
      setEditando(null)
      setShowForm(false)
      cargar()
    } catch (err) {
      mostrarMensaje('Error al guardar el candidato', 'error')
    }
  }

  const handleEditar = (candidato) => {
    setForm({
      nombre: candidato.nombre,
      descripcion: candidato.descripcion || '',
      propuesta: candidato.propuesta || '',
      eleccion: candidato.eleccion,
    })
    setEditando(candidato.id)
    setShowForm(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este candidato?')) return
    try {
      await api.delete(`candidatos/${id}/`)
      mostrarMensaje('Candidato eliminado correctamente')
      cargar()
    } catch (err) {
      mostrarMensaje('Error al eliminar el candidato', 'error')
    }
  }

  const handleCancelar = () => {
    setForm(EMPTY_FORM)
    setEditando(null)
    setShowForm(false)
  }

  const getNombreEleccion = (id) => {
    const e = elecciones.find(e => e.id === id)
    return e ? e.nombre : '-'
  }

  return (
    <AdminLayout>
      <div className={styles.header}>
        <div>
          <h2 className={styles.titulo}>Gestión de Candidatos</h2>
          <p className={styles.subtitulo}>Registra y administra los candidatos por elección</p>
        </div>
        {!showForm && (
          <button className={styles.btnNuevo} onClick={() => setShowForm(true)}>
            + Nuevo Candidato
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
            {editando ? 'Editar Candidato' : 'Nuevo Candidato'}
          </h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Nombre completo"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  required
                />
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Descripción</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Breve descripción"
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Propuesta</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Propuesta principal"
                  value={form.propuesta}
                  onChange={e => setForm({ ...form, propuesta: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancelar} onClick={handleCancelar}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnGuardar}>
                {editando ? 'Actualizar' : 'Crear Candidato'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Cargando candidatos...</div>
      ) : (
        <div className={styles.tabla}>
          <div className={styles.tablaHeader} style={{ gridTemplateColumns: '2fr 2fr 1fr' }}>
            <span>Nombre</span>
            <span>Elección</span>
            <span>Acciones</span>
          </div>
          {candidatos.length === 0 ? (
            <div className={styles.empty}>No hay candidatos registrados aún.</div>
          ) : (
            candidatos.map(c => (
              <div key={c.id} className={styles.tablaRow} style={{ gridTemplateColumns: '2fr 2fr 1fr' }}>
                <span className={styles.rowNombre}>{c.nombre}</span>
                <span className={styles.rowFecha}>{getNombreEleccion(c.eleccion)}</span>
                <span className={styles.rowAcciones}>
                  <button className={styles.btnEditar} onClick={() => handleEditar(c)}>Editar</button>
                  <button className={styles.btnEliminar} onClick={() => handleEliminar(c.id)}>Eliminar</button>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  )
}