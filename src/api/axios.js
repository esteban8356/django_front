import axios from 'axios'
/*estas lineas de codigo nos permite 
realizar peticiones a la api
revisa si hay tokens guardados y los agrega automaticamente al header
asi no hay que mandarlo manualmente*/

const api = axios.create({
  baseURL: 'https://api.187.77.195.31.nip.io/api/',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
// Agrega el token JWT automaticamente a cada petición
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api