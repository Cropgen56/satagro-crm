import { useEffect, useState } from 'react'

export default function useAsyncData(key, loader) {
  const [state, setState] = useState({ key: null, data: null, error: '' })

  useEffect(() => {
    if (key == null) return undefined
    const controller = new AbortController()

    loader(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ key, data, error: '' })
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setState({ key, data: null, error: err?.message || 'Failed to load data' })
        }
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const settled = key != null && state.key === key
  return {
    data: settled ? state.data : null,
    error: settled ? state.error : '',
    loading: key != null && !settled,
  }
}
