const TOKEN_KEY = 'zerith_token'

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function login(email, password) {
  if (email === 'admin@zerith.com.br' && password === 'zerith2026') {
    localStorage.setItem(TOKEN_KEY, 'admin-token-2026')
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}
