import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(e  => setState({ data: null, loading: false, error: e.message }))
  }, [url])

  return state
}
