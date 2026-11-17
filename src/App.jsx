import { useEffect, useState } from 'react'
import { catalog, clearToken, login, readToken, writeToken } from './api.js'
import { Home } from './Home.jsx'
import { Login } from './Login.jsx'
import { scenarioFromHash } from './scenarios.js'
import { Talk } from './Talk.jsx'

function currentHash() {
  return scenarioFromHash(window.location.hash)?.id ?? null
}

export function App() {
  const [token, setToken] = useState(readToken)
  const [catalogData, setCatalogData] = useState(null)
  const [scenarioId, setScenarioId] = useState(currentHash)
  const [booting, setBooting] = useState(Boolean(readToken()))
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    function sync() {
      setScenarioId(currentHash())
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    if (!token) {
      setCatalogData(null)
      setBooting(false)
      return undefined
    }
    let cancelled = false
    setBooting(true)
    catalog(token)
      .then((data) => {
        if (!cancelled) setCatalogData(data)
      })
      .catch((error) => {
        if (!cancelled) {
          clearToken()
          setToken('')
          setCatalogData(null)
          setLoginError(error.message)
        }
      })
      .finally(() => {
        if (!cancelled) setBooting(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  function navigate(id) {
    const next = id ? `#${id}` : '#inicio'
    if (window.location.hash !== next) window.location.hash = next
    else setScenarioId(id || null)
  }

  async function handleLogin(next) {
    setLoginLoading(true)
    setLoginError('')
    try {
      await login(next)
      writeToken(next)
      setToken(next)
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setLoginLoading(false)
    }
  }

  function signOut() {
    clearToken()
    setToken('')
    setCatalogData(null)
    setScenarioId(null)
    window.history.replaceState({}, '', window.location.pathname)
  }

  if (!token || !catalogData) {
    return <Login error={loginError} loading={loginLoading || booting} onSubmit={handleLogin} />
  }

  const scenario = scenarioFromHash(`#${scenarioId ?? ''}`)
  if (!scenario) {
    return <Home onOpen={navigate} onSignOut={signOut} />
  }

  return (
    <Talk
      key={scenario.id}
      token={token}
      agent={catalogData.agent}
      variables={catalogData.variables || []}
      scenario={scenario}
      onNavigate={navigate}
      onSignOut={signOut}
    />
  )
}
