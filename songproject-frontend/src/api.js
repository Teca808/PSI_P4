import { useAuthStore } from '@/stores/auth'

const BASE_URL = import.meta.env.VITE_API_URL

/**
 * Wrapper de fetch que añade la URL base y el header de autenticación
 * si el usuario está logueado.
 */
export async function apiFetch(endpoint, options = {}) {
  const auth = useAuthStore()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // Si hay token, lo añadimos a la cabecera
  if (auth.token) {
    headers['Authorization'] = `Token ${auth.token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API ${response.status}: ${errorText}`)
  }

  // Algunas respuestas (logout, delete...) no devuelven JSON
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }
  return null
}